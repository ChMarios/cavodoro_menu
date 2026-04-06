'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './admin.module.css';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, Plus } from 'lucide-react'; 
import { MENU_STRUCTURE, CATEGORY_ORDER } from '@/lib/constants';

export default function AdminDashboard() {
  const [items, setItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const router = useRouter();

  const [newItem, setNewItem] = useState({
    name_el: '', name_en: '', price: '', category: '', subcategory: '', description_el: '', description_en: ''
  });

  // Filtering: Combines Search text and Category Tab
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name_el.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.name_en.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('id', { ascending: true }); // Always fetch in same DB order

      if (error) throw error;
      if (data) {
        const sortedData = [...data].sort((a, b) => {
          const indexA = CATEGORY_ORDER.indexOf(a.category);
          const indexB = CATEGORY_ORDER.indexOf(b.category);
          
          // 1. Sort by Category Order first
          if (indexA !== indexB) {
            return indexA - indexB;
          }
          
          // 2. Keep stable position inside category using ID instead of name
          return a.id.localeCompare(b.id);
        });
        setItems(sortedData);
      }
    } catch (err) { 
      console.error("Error fetching items:", err); 
    } finally { 
      setLoading(false); 
    }
  };  

  useEffect(() => {
    const checkAdminAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      
      const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
      if (!profile?.is_admin) {
        alert("You do not have access permissions.");
        await supabase.auth.signOut();
        router.push('/login');
      } else {
        setAdminName(user.user_metadata?.first_name || 'Admin');
        fetchItems();
      }
    };
    checkAdminAccess();
  }, [router]);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setNewItem({ name_el: '', name_en: '', price: '', category: '', subcategory: '', description_el: '', description_en: '' });
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const itemData = { 
      name_el: newItem.name_el, 
      name_en: newItem.name_en,
      description_el: newItem.description_el, 
      description_en: newItem.description_en,
      price: parseFloat(newItem.price), 
      category: newItem.category,
      subcategory: (newItem.category && MENU_STRUCTURE[newItem.category]?.subcategories.length > 0) 
        ? newItem.subcategory.trim() || null : null
    };
    try {
      if (editingId) { 
        await supabase.from('menu_items').update(itemData).eq('id', editingId); 
      } else { 
        await supabase.from('menu_items').insert([{ ...itemData, is_available: true }]); 
      }
      closeModal(); 
      fetchItems();
    } catch (err) { 
      alert("Error while saving item."); 
    } finally { 
      setIsSaving(false); 
    }
  };

  const openEditModal = (item: any) => {
    setEditingId(item.id);
    setNewItem({
      name_el: item.name_el, 
      name_en: item.name_en,
      description_el: item.description_el || '', 
      description_en: item.description_en || '',
      price: item.price.toString(), 
      category: item.category, 
      subcategory: item.subcategory || '',
    });
    setIsModalOpen(true);
  };

  const deleteItem = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const { error } = await supabase.from('menu_items').delete().eq('id', id);
      if (error) alert("Delete error");
      else fetchItems();
    }
  };

  const toggleAvailability = async (id: string, current: boolean) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, is_available: !current } : item));
    await supabase.from('menu_items').update({ is_available: !current }).eq('id', id);
  };

  if (loading) return <div className={styles.mainWrapper} style={{padding: '50px', textAlign: 'center'}}>Loading...</div>;

  return (
    <div className={styles.mainWrapper}>
      <nav className={styles.navbar}>
        <h2 className={styles.navTitle}>CAVO D'ORO | {adminName}</h2>
        <button onClick={async () => { await supabase.auth.signOut(); router.push('/login'); router.refresh(); }} className={styles.logoutBtn}>LOGOUT</button>
      </nav>

      <div className={styles.container}>
        
        {/* 1. SEARCH & ADD SECTION */}
        <div className={styles.controls}>
          <input 
            type="text" 
            placeholder="Search for a dish..." 
            className={styles.searchInput} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
          <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Add New Dish
          </button>
        </div>

        {/* 2. CATEGORY TABS */}
        <div className={styles.categoryTabs}>
          <button 
            className={selectedCategory === 'ALL' ? styles.activeTab : styles.tab} 
            onClick={() => setSelectedCategory('ALL')}
          >
            All
          </button>
          {CATEGORY_ORDER.map(key => (
            <button 
              key={key} 
              className={selectedCategory === key ? styles.activeTab : styles.tab} 
              onClick={() => setSelectedCategory(key)}
            >
              {MENU_STRUCTURE[key]?.label.split('|')[0]}
            </button>
          ))}
        </div>

        {/* 3. TABLE SECTION */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Dish Details</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item.id}>
                  <td><strong>{item.name_el}</strong><br/><small style={{color: '#666'}}>{item.name_en}</small></td>
                  <td>
                    {MENU_STRUCTURE[item.category]?.label.split('|')[0] || item.category}
                    {item.subcategory && <div style={{fontSize: '11px', opacity: 0.7}}>({item.subcategory})</div>}
                  </td>
                  <td>{Number(item.price).toFixed(2)}€</td>
                  <td>
                    <button onClick={() => toggleAvailability(item.id, item.is_available)} className={`${styles.statusBtn} ${item.is_available ? styles.available : styles.unavailable}`}>
                      {item.is_available ? 'Available' : 'Sold Out'}
                    </button>
                  </td>
                  <td>
                    <button onClick={() => openEditModal(item)} className={styles.editBtn}><Pencil size={18} /></button>
                    <button onClick={() => deleteItem(item.id)} className={styles.deleteBtn}><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 4. MODAL */}
        {isModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h2 style={{textAlign: 'center', marginBottom: '20px'}}>{editingId ? 'Edit Item' : 'New Dish'}</h2>
              <form onSubmit={handleSaveItem} className={styles.modalForm}>
                <div className={styles.formRow}>
                  <div><label>Name (GR)</label><input required className={styles.modalInput} value={newItem.name_el} onChange={e => setNewItem({...newItem, name_el: e.target.value})} /></div>
                  <div><label>Name (EN)</label><input required className={styles.modalInput} value={newItem.name_en} onChange={e => setNewItem({...newItem, name_en: e.target.value})} /></div>
                </div>
                <label>Description (GR)</label>
                <textarea className={styles.modalInput} value={newItem.description_el} onChange={e => setNewItem({...newItem, description_el: e.target.value})} />
                <label>Description (EN)</label>
                <textarea className={styles.modalInput} value={newItem.description_en} onChange={e => setNewItem({...newItem, description_en: e.target.value})} />
                <div className={styles.formRow}>
                  <div><label>Price</label><input type="number" step="0.1" required className={styles.modalInput} value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} /></div>
                  <div>
                    <label>Category</label>
                    <select className={styles.modalSelect} value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value, subcategory: ''})} required>
                      <option value="">Select Category...</option>
                      {Object.keys(MENU_STRUCTURE).map(key => (<option key={key} value={key}>{MENU_STRUCTURE[key].label}</option>))}
                    </select>
                    {newItem.category && MENU_STRUCTURE[newItem.category]?.subcategories.length > 0 && (
                      <>
                        <label style={{marginTop: '10px', display: 'block'}}>Subcategory</label>
                        <select className={styles.modalSelect} value={newItem.subcategory} onChange={e => setNewItem({...newItem, subcategory: e.target.value})}>
                          <option value="">None</option>
                          {MENU_STRUCTURE[newItem.category].subcategories.map(sub => (<option key={sub.el} value={sub.el}>{sub.el} | {sub.en}</option>))}
                        </select>
                      </>
                    )}
                  </div>
                </div>
                <div className={styles.modalActions}>
                  <button type="submit" className={styles.saveBtn} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</button>
                  <button type="button" onClick={closeModal} className={styles.cancelBtn}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
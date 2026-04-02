'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './menu.module.css';
import { MENU_STRUCTURE, CATEGORY_ORDER } from '@/lib/constants';

export default function MenuPage() {
  const [dishes, setDishes] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState(CATEGORY_ORDER[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMenu() {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_available', true);
      
      if (!error && data) setDishes(data);
      setLoading(false);
    }
    fetchMenu();
  }, []);

  if (loading) return <div className={styles.loading}>Φόρτωση / Loading...</div>;

  const currentDishes = dishes.filter(d => d.category === activeCategory);
  const categoryLabel = MENU_STRUCTURE[activeCategory].label;
  const [greekTitle, englishTitle] = categoryLabel.split(' | ');

  const allPossibleSubs = MENU_STRUCTURE[activeCategory].subcategories.map(s => s.el);
  const usedSubs = allPossibleSubs.filter(subName => 
    currentDishes.some(d => d.subcategory === subName)
  );
  if (currentDishes.some(d => !d.subcategory || d.subcategory === "")) {
    usedSubs.push(null as any);
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.logo}>Cavo D'oro</h1>
        <div className={styles.logoUnderline}></div>
        <p className={styles.tagline}>Καλή σας όρεξη !!! • Bon appétit !!!</p>
      </header>

      {/* --- MOBILE TABS --- */}
      <div className={styles.navWrapper}>
        <nav className={styles.tabsContainer}>
          {CATEGORY_ORDER.map(catKey => {
            const label = MENU_STRUCTURE[catKey].label.replace('|', '•');
            return (
              <button
                key={catKey}
                className={`${styles.tabButton} ${activeCategory === catKey ? styles.activeTab : ''}`}
                onClick={() => setActiveCategory(catKey)}
              >
                {label}
              </button>
            );
          })}
        </nav>
      </div>

      <main className={styles.mainContent}>
        <div className={styles.categoryTitle}>
          <span className={styles.titleGreek}>{greekTitle}</span>
          <span className={styles.currency}>€</span>
          <span className={styles.titleEnglish}>{englishTitle}</span>
        </div>

        {usedSubs.map(subName => {
          const subData = MENU_STRUCTURE[activeCategory].subcategories.find(s => s.el === subName);
          const subDishes = currentDishes.filter(d => d.subcategory === subName || (!subName && !d.subcategory));

          if (subDishes.length === 0) return null;

          return (
            <div key={subName || 'general'} className={styles.subGroup}>
              {subName && (
                <div className={styles.subcategoryHeaderRow}>
                  <div className={styles.subGreek}>{subData?.el || subName}</div>
                  <div className={styles.subEnglish}>{subData?.en || ""}</div>
                </div>
              )}

              <div className={styles.menuList}>
                {subDishes.map(dish => (
                  <div key={dish.id} className={styles.dishItem}>
                    {/* ΕΛΛΗΝΙΚΑ */}
                    <div className={styles.greekCol}>
                      <div className={styles.dishName}>{dish.name_el}</div>
                      {dish.description_el && <p className={styles.dishDesc}>({dish.description_el})</p>}
                    </div>

                    {/* ΤΙΜΗ */}
                    <div className={styles.priceCol}>
                      {Number(dish.price).toFixed(2)}
                    </div>

                    {/* ΑΓΓΛΙΚΑ */}
                    <div className={styles.englishCol}>
                      <div className={styles.dishName}>{dish.name_en}</div>
                      {dish.description_en && <p className={styles.dishDesc}>({dish.description_en})</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
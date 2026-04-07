'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './menu.module.css';
import { MENU_STRUCTURE, CATEGORY_ORDER } from '@/lib/constants';

export default function MenuPage() {
  const [dishes, setDishes] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState(CATEGORY_ORDER[0]);
  const [loading, setLoading] = useState(true);
  
  // Refs για να ξέρουμε πού βρίσκεται κάθε κατηγορία
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchMenu() {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_available', true)
        .order('id', { ascending: true });

      if (!error && data) {
        const finalSorted = data.sort((a, b) => {
          const indexA = CATEGORY_ORDER.indexOf(a.category);
          const indexB = CATEGORY_ORDER.indexOf(b.category);
          if (indexA !== indexB) return indexA - indexB;
          return a.id < b.id ? -1 : 1;
        });
        setDishes(finalSorted);
      }
      setLoading(false);
    }
    fetchMenu();
  }, []);

  // --- INTERSECTION OBSERVER (ScrollSpy) ---
  useEffect(() => {
    if (loading) return;

    const observerOptions = {
      root: null,
      rootMargin: '-100px 0px -70% 0px', // Πότε θεωρείται "ενεργή" μια κατηγορία
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveCategory(entry.target.id);
          // Αυτόματο σκρολάρισμα του tab για να φαίνεται πάντα το ενεργό
          const activeTab = document.getElementById(`tab-${entry.target.id}`);
          if (activeTab && tabsRef.current) {
            activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Παρακολούθηση των sections
    Object.values(sectionRefs.current).forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [loading, dishes]);

  // --- SMOOTH SCROLL FUNCTION ---
  const scrollToCategory = (catKey: string) => {
    const element = sectionRefs.current[catKey];
    if (element) {
      const offset = 100; // Απόσταση από την κορυφή (για το sticky header)
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      });
    }
  };

  if (loading) return <div className={styles.loading}>Φόρτωση / Loading...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.logo}>Cavo D'oro</h1>
        <div className={styles.logoUnderline}></div>
        <p className={styles.tagline}>Καλή σας όρεξη !!! • Bon appétit !!!</p>
      </header>

      {/* --- STICKY TABS --- */}
      <div className={styles.navWrapper}>
        <nav className={styles.tabsContainer} ref={tabsRef}>
          {CATEGORY_ORDER.map(catKey => {
            const label = MENU_STRUCTURE[catKey].label.replace('|', '•');
            return (
              <button
                key={catKey}
                id={`tab-${catKey}`}
                className={`${styles.tabButton} ${activeCategory === catKey ? styles.activeTab : ''}`}
                onClick={() => scrollToCategory(catKey)}
              >
                {label}
              </button>
            );
          })}
        </nav>
      </div>

      <main className={styles.mainContent}>
        {CATEGORY_ORDER.map((catKey) => {
          const categoryDishes = dishes.filter(d => d.category === catKey);
          if (categoryDishes.length === 0) return null;

          const [greekTitle, englishTitle] = MENU_STRUCTURE[catKey].label.split(' | ');

          // Υπολογισμός υποκατηγοριών για τη συγκεκριμένη κατηγορία
          const allPossibleSubs = MENU_STRUCTURE[catKey].subcategories.map(s => s.el);
          const usedSubs = allPossibleSubs.filter(subName => 
            categoryDishes.some(d => d.subcategory === subName)
          );
          if (categoryDishes.some(d => !d.subcategory || d.subcategory === "")) {
            usedSubs.push(null as any);
          }

          return (
            <section 
              key={catKey} 
              id={catKey} 
              ref={el => { sectionRefs.current[catKey] = el; }}
              className={styles.categorySection}
            >
              <div className={styles.categoryTitle}>
                <span className={styles.titleGreek}>{greekTitle}</span>
                <span className={styles.currency}>€</span>
                <span className={styles.titleEnglish}>{englishTitle}</span>
              </div>

              {usedSubs.map(subName => {
                const subData = MENU_STRUCTURE[catKey].subcategories.find(s => s.el === subName);
                const subDishes = categoryDishes.filter(d => d.subcategory === subName || (!subName && !d.subcategory));

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
                          <div className={styles.greekCol}>
                            <div className={styles.dishName}>{dish.name_el}</div>
                            {dish.description_el && <p className={styles.dishDesc}>{dish.description_el}</p>}
                          </div>
                          <div className={styles.priceCol}>{Number(dish.price).toFixed(2)}</div>
                          <div className={styles.englishCol}>
                            <div className={styles.dishName}>{dish.name_en}</div>
                            {dish.description_en && <p className={styles.dishDesc}>{dish.description_en}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </section>
          );
        })}
      </main>
      <footer className={styles.footer}>
      <div className={styles.footerGrid}>
        {/* Αριστερή Στήλη - Ελληνικά */}
        <div className={styles.footerCol}>
          <p>Τα κρεατικά μας γαρνίρονται με πατάτες φρέσκιες τηγανητές ή ρύζι ή μακαρόνια χωρίς έξτρα χρέωση</p>
          <p>Οι μισές μερίδες χρεώνονται με 10% επιπλέον</p>
          <p>Ο αστερίσκος (*) αναφέρεται σε κατεψυγμένα προϊόντα</p>
          <p>Για το μαγείρεμα χρησιμοποιείται έξτρα παρθένο ελαιόλαδο, για το δε τηγάνισμα ηλιέλαιο</p>
          <p>Όλα τα κρέατα μας είναι φρέσκα</p>
          <p>Ο κιμάς που χρησιμοποιούμε είναι 100% φρέσκος μοσχαρίσιος κιμάς ντόπιας εκτροφής</p>
          <p>Στις τιμές συμπεριλαμβάνονται όλες οι νόμιμες επιβαρύνσεις</p>
        </div>

        {/* Δεξιά Στήλη - English */}
        <div className={styles.footerCol}>
          <p>Our meat dishes are garnished with fresh fries, rice or pasta at no extra charge.</p>
          <p>Half portions are charged extra at 10% above half price</p>
          <p>Asterisk (*) refers to frozen products</p>
          <p>We use extra virgin olive oil for cooking. We use sunflower oil for frying</p>
          <p>All our meat is fresh</p>
          <p>The minced meat we use is from 100% locally sourced beef.</p>
          <p>All legal taxes are included</p>
        </div>
      </div>

      <div className={styles.footerGeneralInfo}>
        <p className={styles.responsible}>Αγορανομικός υπεύθυνος: <strong>Κυριάκος Μούτσης</strong></p>
        <p className={styles.responsible}>Inspection responsible: <strong>Kyriakos Moutsis</strong></p>
        
        <div className={styles.facebookInfo}>
          <p>Για περισσότερες λεπτομέρειες επισκεφθείτε την σελίδα μας:</p>
          <p className={styles.fbLink}>CAVODORO traditional restaurant στο FACEBOOK</p>
          <p className={styles.fbLinkEn}>For more information, please visit our Facebook page: CAVODORO traditional restaurant</p>
        </div>
      </div>
    </footer>
    </div>
  );
}
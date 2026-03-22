import { supabase } from '@/lib/supabase';
import styles from './menu.module.css';
import { MENU_STRUCTURE, CATEGORY_ORDER } from '@/lib/constants';

export const revalidate = 0;

export default async function MenuPage() {

  const { data: dishes, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('is_available', true);

  if (error) return <div className={styles.container}>Error loading menu...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.logo}>Cavo D'oro</h1>
        <div className={styles.divider}></div>
        <p className={styles.tagline}>Καλή σας όρεξη !!! • Bon appétit !!!</p>
      </header>

      {CATEGORY_ORDER.map(catKey => {
        const catDishes = dishes?.filter(d => d.category === catKey) || [];

        if (catDishes.length === 0) return null;

        const [greekTitle, englishTitle] = MENU_STRUCTURE[catKey].label.split(' | ');

        // --- ΕΔΩ ΕΙΝΑΙ Η ΑΛΛΑΓΗ ΓΙΑ ΤΗ ΣΩΣΤΗ ΣΕΙΡΑ ---
        // Αντί για τυχαία σειρά, παίρνουμε τις υποκατηγορίες όπως τις γράψαμε στο constants.ts
        const allPossibleSubs = MENU_STRUCTURE[catKey].subcategories.map(s => s.el);
        const usedSubs = allPossibleSubs.filter(subName => 
          catDishes.some(d => d.subcategory === subName)
        );

        // Αν υπάρχουν πιάτα χωρίς υποκατηγορία, τα βάζουμε στο τέλος
        if (catDishes.some(d => !d.subcategory || d.subcategory === "")) {
          usedSubs.push(null as any);
        }
        // --------------------------------------------

        return (
          <section key={catKey} className={styles.categorySection}>
            <div className={styles.categoryTitle}>
              <span className={styles.titleGreek}>{greekTitle}</span>
              <span className={styles.currency}>€</span>
              <span className={styles.titleEnglish}>{englishTitle}</span>
            </div>

            {usedSubs.map(subName => {
              const subData = MENU_STRUCTURE[catKey].subcategories.find(s => s.el === subName);
              const subDishes = catDishes.filter(d => d.subcategory === subName || (!subName && !d.subcategory));

              if (subDishes.length === 0) return null;

              return (
                <div key={subName || 'general'} className={styles.subGroup}>
                  {subName && (
                    <div className={styles.subcategoryHeaderRow}>
                      <div className={styles.subGreek}>{subData?.el || subName}</div>
                      <div className={styles.subSpacer}></div>
                      <div className={styles.subEnglish}>{subData?.en || ""}</div>
                    </div>
                  )}

                  <div className={styles.menuList}>
                    {subDishes.map(dish => (
                      <div key={dish.id} className={styles.dishItem}>
                        <div className={styles.greekCol}>
                          <span className={styles.dishName}>{dish.name_el}</span>
                          {dish.description_el && <p className={styles.dishDesc}>{dish.description_el}</p>}
                        </div>
                        <div className={styles.priceCol}>{Number(dish.price).toFixed(2)}</div>
                        <div className={styles.englishCol}>
                          <span className={styles.dishName}>{dish.name_en}</span>
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
    </div>
  );
}
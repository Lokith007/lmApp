// cartService.js
import {
    collection,
    doc,
    getDocs,
    limit,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where,
  } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';  
  // ──────────────────────────────────────────────────────────────
  // addToCart({ userId, restaurant, dish, quantity })
  // ──────────────────────────────────────────────────────────────
  export async function addToCart({ userId, restaurant, dish, quantity = 1 }) {
    // 1. look for an existing cart
    const cartQ = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      where('orderStatus', '==', 'cart'),
      limit(1)
    );
  
    const snap = await getDocs(cartQ);
  
    // 2. If a cart already exists …
    if (!snap.empty) {
      const cartDoc = snap.docs[0];
      const cartRef = cartDoc.ref;
      const cart    = cartDoc.data();
  
      // 2a. restaurant mismatch → block
      if (cart.restaurantId !== restaurant.id) {
        throw new Error(
          'Your cart already contains items from another restaurant. Please clear it first.'
        );
      }
  
      // 2b. Update / merge items
      const items        = [...cart.items];
      const idx          = items.findIndex(i => i.dishId === dish.id);
      if (idx > -1) {
        items[idx].quantity += quantity;
      } else {
        items.push({
          dishId: dish.id,
          name: dish.name,
          price: dish.price,
          quantity,
        });
      }
  
      const totalAmount = items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );
  
      await updateDoc(cartRef, {
        items,
        totalAmount,
        updatedAt: serverTimestamp(),
      });
  
      return cartRef.id; // useful if caller needs it
    }
  
    // 3. No cart → create new one
    const cartRef = doc(collection(db, 'orders')); // random id
    await setDoc(cartRef, {
      orderId: cartRef.id,
      userId,
      restaurantId: restaurant.id,
      items: [
        {
          dishId: dish.id,
          name: dish.name,
          price: dish.price,
          quantity,
        },
      ],
      totalAmount: dish.price * quantity,
      orderStatus: 'cart',   // ← key!
      paymentStatus: 'unpaid',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  
    return cartRef.id;
  }
  
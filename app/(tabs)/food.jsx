// CartScreen.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { db , FIREBASE_AUTH } from '../../FirebaseConfig';

import {
  collection,
  query,
  where,
  limit,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';

export default function CartScreen() {
  const [cartId, setCartId]   = useState(null);
  const [items, setItems]     = useState([]);
  const [total, setTotal]     = useState(0);
  const user = FIREBASE_AUTH.currentUser;

  // ────────────────────────────────────────────────
  // 1. Listen for the active cart in real‑time
  // ────────────────────────────────────────────────
  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid),
      where('orderStatus', '==', 'cart'),
      limit(1)
    );

    const unsub = onSnapshot(q, snap => {
      if (snap.empty) {
        setCartId(null);
        setItems([]);
        setTotal(0);
        return;
      }

      const docSnap = snap.docs[0];
      const data    = docSnap.data();

      setCartId(docSnap.id);
      setItems(data.items);
      setTotal(data.totalAmount);
    });

    return unsub;           // cleanup
  }, [user?.uid]);

  // ────────────────────────────────────────────────
  // 2. Helpers ‑ add / remove quantity
  // ────────────────────────────────────────────────
  const changeQty = async (index, delta) => {
    if (!cartId) return;

    const cartRef   = doc(db, 'orders', cartId);
    const newItems  = [...items];
    newItems[index].quantity += delta;

    // Remove item if quantity drops to 0
    if (newItems[index].quantity <= 0) newItems.splice(index, 1);

    // Cart empty? -> delete doc & return
    if (newItems.length === 0) {
      await deleteDoc(cartRef);
      return;
    }

    // Re‑calc total
    const newTotal = newItems.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    await updateDoc(cartRef, {
      items: newItems,
      totalAmount: newTotal,
      updatedAt: serverTimestamp(),
    });
  };

  // ────────────────────────────────────────────────
  // 3. UI
  // ────────────────────────────────────────────────
  const renderItem = ({ item, index }) => (
    <View
      key={item.dishId}
      className="flex-row justify-between items-center py-3 border-b border-gray-200"
    >
      <View>
        <Text className="text-lg font-semibold">{item.name}</Text>
        <Text className="text-gray-500">₹{item.price}</Text>
      </View>

      <View className="flex-row items-center space-x-4">
        <TouchableOpacity onPress={() => changeQty(index, -1)}>
          <Text className="text-2xl">-</Text>
        </TouchableOpacity>

        <Text className="text-xl">{item.quantity}</Text>

        <TouchableOpacity onPress={() => changeQty(index, +1)}>
          <Text className="text-2xl">+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!user?.uid) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Please sign in to view your cart.</Text>
      </View>
    );
  }

  if (!cartId) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Your cart is empty.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-4">
      <FlatList
        data={items}
        keyExtractor={item => item.dishId}
        renderItem={renderItem}
      />

      <View className="py-4 border-t border-gray-200">
        <Text className="text-xl font-bold text-right">
          Total  ₹{total}
        </Text>
      </View>
    </View>
  );
}

import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../../FirebaseConfig';
import DishCard from '../../components/DishCard';
import DishModal from '../../components/DishModal';
const screenWidth = Dimensions.get("window").width;
const horizontalPadding = 40; // px-5 on both sides = 20 + 20
const cardGap = 20; // gap between cards
const cardsPerRow = 2;

const totalGap = cardGap * (cardsPerRow - 1);
const cardWidth = (screenWidth - horizontalPadding - totalGap) / cardsPerRow;


export default function RestaurantScreen() {
  const { restaurantId } = useLocalSearchParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [selectedDish, setSelectedDish] = useState(null);
  
  // fetch restaurant header + dishes
  useEffect(() => {
    async function load() {
      try {
        // ── restaurant document
        const restSnap = await getDoc(doc(db, 'restaurants', restaurantId));
        if (restSnap.exists()) {
          setRestaurant({ id: restSnap.id, ...restSnap.data() });
        }

        // ── its menu sub‑collection, ordered by freq (all dishes, no limit)
        const menuQuery = query(
          collection(db, 'restaurants', restaurantId, 'menu'),
          where('freq', '>=', 0),
          orderBy('freq', 'desc')
        );
        const menuSnap = await getDocs(menuQuery);
        const dishes = menuSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setMenu(dishes);
      } catch (err) {
        console.error('Error loading restaurant page:', err);
      }
    }
    load();
  }, [restaurantId]);

  return (
    <View className="flex-1 p-4">
      {restaurant && (
        <>
          <Image
            source={{ uri: restaurant.logo }}
            className="w-full h-48 rounded-xl"
            resizeMode="cover"
          />
          <Text className="text-2xl font-bold mt-3">{restaurant.name}</Text>
          <Text className="text-sm text-gray-500 mb-4">{restaurant.admin}</Text>
        </>
      )}

      <FlatList
        data={menu}
        keyExtractor={item => item.id}
        numColumns={2}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        className="mb-4 mt-3"
        renderItem={({ item, index }) => (
          <DishCard
            item={item}
            index={index}
            variant="grid"
            cardWidth={cardWidth}
            showRank={false}
            onPress={() => setSelectedDish(item)}

          />)}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: cardGap,
          marginBottom: 10,
        }}
      />
            <DishModal
        visible={!!selectedDish}
        dish={selectedDish}
        restaurant={restaurant}
        onClose={() => setSelectedDish(null)}

      />

    </View>
  );
}

// tabs/Home.jsx
import { View, Text, ScrollView, FlatList, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { db } from '../../FirebaseConfig';
import {
  collection,
  collectionGroup,
  getDocs,
  orderBy,
  limit,
  where,
  query,
} from 'firebase/firestore';
import HorizontalList from '../../components/HorizontalList';
import RestaurantCard from '../../components/RestaurantCard';

import DishCard from '../../components/DishCard';
const screenWidth = Dimensions.get("window").width;
const horizontalPadding = 40; // px-5 on both sides = 20 + 20
const cardGap = 20; // gap between cards
const cardsPerRow = 2;

const totalGap = cardGap * (cardsPerRow - 1);
const cardWidth = (screenWidth - horizontalPadding - totalGap) / cardsPerRow;

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [trending, setTrending] = useState([]);

  // Fetch all restaurants
  const fetchRestaurants = async () => {
    try {
      const ref = collection(db, 'restaurants');
      const snapshot = await getDocs(ref);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRestaurants(data);
    } catch (err) {
      console.error('Error fetching restaurants:', err);
    }
  };

  // Optimized: Fetch top 10 trending dishes using collectionGroup
  const fetchTrending = async () => {
    try {
      const trendingQuery = query(
        collectionGroup(db, 'menu'),
        where('freq', '>', 0),
        orderBy('freq', 'desc'),
        limit(10)
      );

      const snapshot = await getDocs(trendingQuery);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        restaurantId: doc.ref.parent.parent.id,
        ...doc.data()
      }));

      setTrending(data);
    } catch (err) {
      console.error('Error fetching trending items:', err);
    }
  };

  useEffect(() => {
    fetchRestaurants();
    fetchTrending();
  }, []);

  return (
    <ScrollView className="flex-1 bg-white px-4 pt-8 h-screen-safe-or-80">
      {/* All Restaurants */}
      <Text className="text-2xl font-bold text-purple-500 mb-2">All Restaurants</Text>
      <HorizontalList
        data={restaurants}       // ← your state
        renderItem={({ item, index }) => (
          <RestaurantCard restaurant={item} index={index} />
        )}
      />

      {/* Trending Dishes */}
      <Text className="text-2xl font-bold text-purple-500 mt-8 mb-10">Trending Dishes</Text>
      <FlatList
        data={trending}
        keyExtractor={item => item.id}
        numColumns={2}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        className="mb-4 mt-3"
        renderItem={({ item, index }) => (
          <DishCard
            item={item}
            index={index}
            variant="grid"
            cardWidth={cardWidth}
            href={`/food/${item.name ?? item.dishName}`}
            showRank = {true}
            
          />)}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: cardGap,
          marginBottom: 10,
        }}
      />
    </ScrollView>
  );
};

export default Home;

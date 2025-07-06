import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import Loader from '../../components/Loader';
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
  const [loading, setLoading] = useState(false);

  // fetch restaurant header + dishes
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [restaurantId]);

  if (loading) return <Loader text='Loading restaurant details...' />;

  return (
    // <SafeAreaView>
    <SafeAreaView className='bg-white h-full'>
      <View className="flex-1 p-4">
        {/* header */}
        {restaurant &&
          <View className="flex-row items-center justify-between mb-4 px-2">
            <TouchableOpacity onPress={() => router.back()} className='w-32'>
              <Ionicons name="arrow-back" size={28} color="#333" />
            </TouchableOpacity>

            <Text className="text-xl font-bold text-primary flex-1 text-center -ml-6">
              {restaurant.name}
            </Text>

            <View className="w-32"></View>
          </View>
        }

        {/* food details */}
        <FlatList
          ListHeaderComponent={restaurant && <RestaurantHeader restaurant={restaurant} />}
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
              cardWidth={screenWidth / 2.27}
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
    </SafeAreaView>
  );
}

const RestaurantHeader = ({ restaurant }) => (
  <View>

    <Image
      source={{ uri: restaurant.logo }}
      className="w-full h-60 rounded-xl mb-5"
      resizeMode="contain"
    />
  </View>
)

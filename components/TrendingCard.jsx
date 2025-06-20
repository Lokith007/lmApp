import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';
import MaskedView from '@react-native-masked-view/masked-view';
import rankingGradient from '../assets/rankingGradient.png';

const TrendingCard = ({ item, index , cardWidth}) => {
  const { name, description, imageUrl, price, isAvailable } = item;

  return (
    <View style={{ width: cardWidth }}>
    <Link href={`/food/${name}`} asChild>
      <TouchableOpacity className="w-40 relative pl-5">
        <Image
          source={{ uri: imageUrl }}
          className="w-40 h-40 rounded-lg"
          resizeMode="cover"
        />

        <View className="absolute bottom-9 -left-3.5 -top-6 px-2 py-1 rounded-full">
          <MaskedView
            maskElement={
              <Text className="font-bold text-white text-6xl">
                {index + 1}
              </Text>
            }
          >
            <Image
              source={rankingGradient}
              className="size-14"
              resizeMode="cover"
            />
          </MaskedView>
        </View>

        <Text
          className="text-base font-bold mt-2 text-light-200"
          numberOfLines={1}
        >
          {name}
        </Text>
        <Text
          className="text-xs text-light-300 mt-1"
          numberOfLines={2}
        >
          {description}
        </Text>
        <Text className="text-sm text-light-100 mt-1 font-semibold">
          ₹{price} {isAvailable ? '' : '(Unavailable)'}
        </Text>
      </TouchableOpacity>
    </Link>
    </View>
  );
};

export default TrendingCard;

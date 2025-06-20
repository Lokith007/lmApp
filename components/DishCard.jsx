import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';
import MaskedView from '@react-native-masked-view/masked-view';
import rankingGradient from '../assets/rankingGradient.png';

/**
 * Reusable food‑item card (grid‑only).
 *
 * @param {object}  item        – dish document (name/dishName, imageUrl, price, …)
 * @param {number}  index       – list index (0‑based) → used for ranking overlay
 * @param {number}  cardWidth   – width of the square card
 * @param {string}  href        – optional deep‑link (expo‑router)
 * @param {boolean} showRank    – force show / hide the ①②③ badge
 */
export default function DishCard({
  item,
  index = 0,
  cardWidth = 140,
  href,
  showRank,
  onPress,
}) {
  // ── field fallbacks (DBs don’t always agree on naming)
  const title       = item.name      ?? item.dishName;
  const imgSrc      = item.imageUrl  ?? item.image;
  const description = item.description ?? '';
  const price       = item.price     ?? '—';
  const isAvailable = item.isAvailable ?? true;

  /* ---------- common inner body ---------- */
  const CardInner = (
    <TouchableOpacity
      activeOpacity={0.85}
      style={{ width: cardWidth }}
      className="relative"
      onPress={onPress}

    >
      {/* IMAGE */}
      <Image
        source={{ uri: imgSrc }}
        className="w-full h-40 rounded-lg"
        resizeMode="cover"
      />

      {/* RANK BADGE (only if showRank = true) */}
      {showRank && (
        <View className="absolute bottom-9 -left-3.5 -top-1 px-2 py-1 rounded-full">
          <MaskedView
            maskElement={
              <Text className="font-bold text-white text-6xl">
                {index + 1}
              </Text>
            }
          >
            <Image source={rankingGradient} className="size-14" />
          </MaskedView>
        </View>
      )}

      {/* TEXT BLOCK */}
      <View>
        <Text
          className="text-base font-bold mt-2 text-light-200"
          numberOfLines={1}
        >
          {title}
        </Text>

        {!!description && (
          <Text className="text-xs text-light-300 mt-1" numberOfLines={2}>
            {description}
          </Text>
        )}

        <Text className="text-sm mt-1 font-semibold text-light-100">
          ₹{price} {isAvailable ? '' : '(Unavailable)'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  /* ---------- wrapper: link vs. plain ---------- */
  const maybeLinked = href ? (
    <Link href={href} asChild>
      {CardInner}
    </Link>
  ) : (
    CardInner
  );

  /* ---------- final return ---------- */
  return <View style={{ width: cardWidth }}>{maybeLinked}</View>;
}

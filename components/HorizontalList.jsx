import React from 'react';
import { FlatList } from 'react-native';

export default function HorizontalList({
  data,
  renderItem,
  keyExtractor = (item) => item.id,
  ...rest
}) {
  return (
    <FlatList
      data={data}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      {...rest}
    />
  );
}

import React, { useMemo } from 'react';
import { useParams } from 'react-router-native';
import { useQuery } from '@apollo/client';
import { GET_REPOSITORY } from '../graphql/queries';
import { FlatList, Pressable, View, StyleSheet, Linking } from 'react-native';
import RepositoryItem from './RepositoryItem';
import ReviewItem from './ReviewItem';
import theme from '../theme';

const styles = StyleSheet.create({
  openButton: {
    backgroundColor: theme.colors.primary,
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 12
  }
});

const RepositoryInfo = ({ repository }) => {
  const openBtn = (
    <Pressable style={styles.openButton} onPress={() => Linking.openURL(repository.url)}>
      <View><RepositoryItem item={repository} showOpenButton={null} /></View>
    </Pressable>
  );
  return (
    <View>
      <RepositoryItem item={repository} />
      <Pressable style={styles.openButton} onPress={() => Linking.openURL(repository.url)}>
        <View><RepositoryItem item={{...repository, fullName: 'Open in GitHub'}} showOpenButton /></View>
      </Pressable>
    </View>
  );
};

const SingleRepository = () => {
  const { id } = useParams();
  const variables = useMemo(() => ({ id, first: 6 }), [id]);

  const { data, loading, fetchMore } = useQuery(GET_REPOSITORY, {
    variables,
    fetchPolicy: 'cache-and-network'
  });

  const repository = data?.repository;
  const reviews = repository?.reviews?.edges.map(e => e.node) ?? [];

  const onEndReach = () => {
    if (!loading && repository?.reviews?.pageInfo?.hasNextPage) {
      fetchMore({
        variables: { id, first: 6, after: repository.reviews.pageInfo.endCursor }
      });
    }
  };

  if (!repository) return null;

  return (
    <FlatList
      data={reviews}
      renderItem={({ item }) => <ReviewItem review={item} />}
      keyExtractor={(item) => item.id}
      onEndReached={onEndReach}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={() => <RepositoryInfo repository={repository} />}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
    />
  );
};

export default SingleRepository;
import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CURRENT_USER } from '../graphql/queries';
import { DELETE_REVIEW } from '../graphql/mutations';
import { FlatList, View, StyleSheet, Alert, Pressable } from 'react-native';
import ReviewItem from './ReviewItem';
import Text from './Text';
import { useNavigate } from 'react-router-native';
import theme from '../theme';

const styles = StyleSheet.create({
  container: { backgroundColor: theme.colors.white, padding: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  button: { flex: 1, padding: 10, borderRadius: 4, alignItems: 'center', marginHorizontal: 5 },
  viewBtn: { backgroundColor: theme.colors.primary },
  delBtn: { backgroundColor: theme.colors.error }
});

const ReviewWithActions = ({ review, onView, onDelete }) => {
  return (
    <View>
      <ReviewItem review={review} />
      <View style={styles.row}>
        <Pressable style={[styles.button, styles.viewBtn]} onPress={onView}>
          <Text style={{ color: '#fff' }} fontWeight="bold">View repository</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.delBtn]} onPress={onDelete}>
          <Text style={{ color: '#fff' }} fontWeight="bold">Delete review</Text>
        </Pressable>
      </View>
    </View>
  );
};

const MyReviews = () => {
  const { data, refetch } = useQuery(GET_CURRENT_USER, { variables: { includeReviews: true }, fetchPolicy: 'cache-and-network' });
  const [deleteReview] = useMutation(DELETE_REVIEW);
  const navigate = useNavigate();

  const edges = data?.me?.reviews?.edges ?? [];
  const reviews = edges.map(e => e.node);

  const handleDelete = (id) => {
    Alert.alert('Delete review', 'Are you sure you want to delete this review?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await deleteReview({ variables: { id } }); refetch(); } }
    ]);
  };

  return (
    <FlatList
      data={reviews}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ReviewWithActions
          review={item}
          onView={() => navigate(`/repository/${item.repositoryId}`)}
          onDelete={() => handleDelete(item.id)}
        />
      )}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
    />
  );
};

export default MyReviews;
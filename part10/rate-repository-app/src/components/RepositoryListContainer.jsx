import React from 'react';
import { FlatList, View } from 'react-native';
import RepositoryItem from './RepositoryItem';

const ItemSeparator = () => <View style={{ height: 10 }} />;

export class RepositoryListContainer extends React.Component {
  renderHeader = () => {
    const { ListHeaderComponent } = this.props;
    return ListHeaderComponent ? <ListHeaderComponent /> : null;
  };

  render() {
    const { repositories, onEndReach, onItemPress } = this.props;
    const repoNodes = repositories
      ? repositories.edges.map(e => e.node)
      : [];

    return (
      <FlatList
        data={repoNodes}
        ItemSeparatorComponent={ItemSeparator}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View>
            <RepositoryItem item={item} />
          </View>
        )}
        onEndReached={onEndReach}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={this.renderHeader}
      />
    );
  }
}
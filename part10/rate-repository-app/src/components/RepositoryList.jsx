import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-native';
import { useDebounce } from 'use-debounce';
import useRepositories from '../hooks/useRepositories';
import RepositoryListHeader from './RepositoryListHeader';
import { RepositoryListContainer } from './RepositoryListContainer';
import { Pressable } from 'react-native';

const RepositoryList = () => {
  const [order, setOrder] = useState('latest');
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);

  const variables = useMemo(() => {
    let orderBy = 'CREATED_AT';
    let orderDirection = 'DESC';
    if (order === 'highest') { orderBy = 'RATING_AVERAGE'; orderDirection = 'DESC'; }
    if (order === 'lowest') { orderBy = 'RATING_AVERAGE'; orderDirection = 'ASC'; }
    return { orderBy, orderDirection, searchKeyword: debouncedSearch, first: 8 };
  }, [order, debouncedSearch]);

  const { repositories, fetchMore } = useRepositories(variables);
  const navigate = useNavigate();

  const Header = () => (
    <RepositoryListHeader
      order={order} setOrder={setOrder}
      search={search} setSearch={setSearch}
    />
  );

  return (
    <RepositoryListContainer
      repositories={repositories}
      onEndReach={fetchMore}
      ListHeaderComponent={Header}
      onItemPress={(id) => navigate(`/repository/${id}`)}
    />
  );
};

export default RepositoryList;
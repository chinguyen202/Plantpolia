import React from 'react';
import PropTypes from 'prop-types';
import {FlatList, StyleSheet, View} from 'react-native';
import MyPlantListItem from './MyPlantListItem';
import Welcome from './Welcome';
import {colors} from '../../utils/colors';
import {useSearch} from '../../services/useSearch';
import {SearchBar} from '@rneui/themed';
import PlantNotFound from '../shared/PlantNotFound';
import {spacing} from '../../utils/sizes';
import {useMainContext} from '../../contexts/MainContext';

const MyPlantList = ({navigation}) => {
  const {userPlantList} = useMainContext();
  const {search} = useSearch();

  let searchResult = [];
  if (search) {
    searchResult = userPlantList.filter((obj) =>
      obj.title.toLowerCase().includes(search.value.toLowerCase())
    );
  }

  // if (load) {
  //   return <LoadingOverlay />;
  // }

  return (
    <View style={styles.container}>
      <Welcome />
      <SearchBar
        autoCapitalize="none"
        autoCorrect={false}
        lightTheme
        containerStyle={styles.searchBox}
        inputContainerStyle={styles.searchInput}
        inputStyle={{color: colors.primary700}}
        placeholder="Search for plant ..."
        onChangeText={search.update}
        value={search.value}
      />
      {search && searchResult.length != 0 ? (
        <FlatList
          data={searchResult}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <MyPlantListItem plant={item} navigation={navigation} />
          )}
        />
      ) : (
        <PlantNotFound navigation={navigation} isUserList={true} />
      )}
      {!search && (
        <FlatList
          data={userPlantList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            // console.log('ITEM:', item),
            <MyPlantListItem
              plant={item}
              imageUrl={item.thumbnails.w160}
              title={item.title}
              description={item.description}
              navigation={navigation}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchBox: {
    backgroundColor: colors.primary50,
    height: spacing.xxl,
    justifyContent: 'center',
    marginVertical: spacing.md,
  },
  searchInput: {backgroundColor: colors.primary50},
});
MyPlantList.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default MyPlantList;

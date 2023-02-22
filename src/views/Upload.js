import React, {useContext, useState} from 'react';
import PropTypes from 'prop-types';
import {ScrollView, View, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UploadForm from '../components/UploadForm';
import {MainContext} from '../contexts/MainContext';
import {userTag} from '../utils/variables';
import {useMedia, useTag} from '../hooks/ApiHooks';
import LoadingOverlay from '../components/shared/LoadingOverlay';
import ErrorOverlay from '../components/shared/ErrorOverlay';
import {spacing} from '../utils/sizes';

const Upload = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const {postMedia} = useMedia();
  const {postTag} = useTag();
  const {
    image,
    imageSelected,
    type,
    update,
    upload,
    setUpload,
    setUpdate,
    setLastWater,
    setNotificationTime,
  } = useContext(MainContext);

  const plantData = route.params.plant;
  let isOthers = false;
  if (plantData.title === 'Others') {
    isOthers = true;
  }

  // Get the prefix days between watering
  const prefixWaterInterval = JSON.parse(plantData.description);
  // console.log(prefixWaterInterval);

  const handlerSubmit = async (data) => {
    // If the upload plant belong to prefix list
    if (!isOthers) {
      data.description.waterInterval = prefixWaterInterval.waterInterval;
    }
    const addData = JSON.stringify(data.description);

    // Get token of user
    const token = await AsyncStorage.getItem('userToken');

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', addData);
    if (imageSelected) {
      const filename = image.split('/').pop();
      let fileExtension = filename.split('.').pop();
      fileExtension = fileExtension === 'jpg' ? 'jpeg' : fileExtension;
      formData.append('file', {
        uri: image,
        name: filename,
        type: type + '/' + fileExtension,
      });
    }
    console.log('FORMDATA: ', formData);

    try {
      setIsLoading(true);
      // console.log('token', token);
      const response = await postMedia(formData, token);
      const tagResponse = await postTag(
        {file_id: response.file_id, tag: userTag},
        token
      );
      setUpload(!upload);
      setUpdate(update + 1);
      console.log('POST RESPONSE: ', response);
      console.log('TAG RESPONSE: ', response);

      setTimeout(() => {
        tagResponse &&
          (setIsLoading(false), navigation.navigate('UploadCompleted'));
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
      // console.log('error', error);
    }

    setLastWater('');
    setNotificationTime('');
  };

  const errorHandler = () => {
    setError(null);
  };

  if (error && !isLoading) {
    return <ErrorOverlay message={error} onConfirm={errorHandler} />;
  }
  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <UploadForm
          plant={plantData}
          isOthers={isOthers}
          onSubmit={handlerSubmit}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: spacing.md,
    marginVertical: spacing.md,
  },
});

Upload.propTypes = {
  route: PropTypes.object,
  navigation: PropTypes.object,
};

export default Upload;

import React, {useState, useEffect} from 'react';
import { ActivityIndicator , StyleSheet, View, Dimensions, Modal, Text, Pressable  } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const branding = {
    "yellow" : '#FCA708',
    "red"    : '#F72B02',
    "black"  : '#000000',
    "white"  : '#FFFFFF',
    "black50": 'rgba(0,0,0,0.5)'
  }

const GlobalModal = (props) => {
    const [modalVisible, setModalVisible] = useState(props.open);

    useEffect(() => {
        setModalVisible(props.open);
    },[props.open]);

  return (
    <Modal
        style={styles.modalWrap}
        animationType={props.animation}
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
            props.updateVis(props.open)
        }}>
        {props.children}
    </Modal>
  );
}

const styles = StyleSheet.create({
});

export default GlobalModal;
import React from 'react';
import { TouchableOpacity,View,Text,StyleSheet,Modal,ActivityIndicator } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import {colors} from "../../utils/theme";
export default class Loader extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            CAT_ID:'',
        }
    }

    componentDidMount = async () => {

    }

    render() {
        return (
        	<View>
	        	<Modal
			        transparent={true}
			        animationType={'none'}
			        visible={true}
			        style={{ zIndex: 1100 }}
			        onRequestClose={() => { }}
			    >
			    	<View style={styles.modalBackground}>
						<View style={styles.activityIndicatorWrapper}>
							<ActivityIndicator animating={this.state.loading} color={colors.themeColor} size="large" />
						</View>
					</View>

				</Modal>
			</View>

        );
    }

}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#rgba(0, 0, 0, 0.5)',
    zIndex: 1000
  },
  activityIndicatorWrapper: {
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
});
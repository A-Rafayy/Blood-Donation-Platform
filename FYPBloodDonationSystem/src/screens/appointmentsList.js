import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, ScrollView, FlatList, TextInput, Button } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faBold, faDroplet } from '@fortawesome/free-solid-svg-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DE0A1E',
    height: 60,
    paddingHorizontal: 10,
  },
  backButton: {
    marginLeft: 10,
  },
  title: {
    fontSize: 18,
    flex: 1,
    textAlign: 'center',
    color: '#FFF',
    fontWeight: 'bold',
  },
  containerTwo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {

  }
});


const AppointmentsList = () => {

  //const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [filteredData, setFilteredData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    
        const appointmentsRef = firestore().collection('appointments');
        const unsubscribe = appointmentsRef.onSnapshot((querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
            const receiverId = doc.data().receiverId;
            const donorId = doc.data().donorId;
            if(auth().currentUser.uid == receiverId){
                if(doc.data().status == 'confirmed' || doc.data().status == 'declined'){
                    data.push({
                    id: doc.id,
                    name: doc.data().donorName,
                    address: doc.data().hospital,
                    bloodGroup: doc.data().bloodType,
                    appointmentDate: doc.data().appointmentDate,
                    status: doc.data().status,
                    type: 'Meeting As Receiver'
                    });
                }
            }
            else if(auth().currentUser.uid == donorId){

                data.push({
                    id: doc.id,
                    name: doc.data().receiverName,
                    address: doc.data().hospital,
                    bloodGroup: doc.data().bloodType,
                    appointmentDate: doc.data().appointmentDate,
                    status: doc.data().status,
                    type: 'Meeting As Donor'
                });

            }
        });
        setFilteredData(data);
        setIsLoading(false);
        });

        return () => {
          // Unsubscribe from the listener when the component is unmounted or when the user logs out
          unsubscribe();
        };
        
  }, []);

  /*useEffect(() => {
    setFilteredData(data);
  }, [data]);*/

  const renderItem = ({ item }) => {

    if (searchQuery && !item.name.includes(searchQuery) && !item.address.includes(searchQuery)) {
        return null;
    }

    return (
    <View style={{ flexDirection: 'column', borderRadius: 10, borderColor: '#808080', borderWidth: 1, padding: 10, marginBottom: 10, justifyContent: 'flex-end', }}>
      <View style={{
        flex: 1,
        flexDirection: 'row',
        //alignItems: 'flex-end',
        alignItems: 'center',
        //justifyContent: 'flex-end',
        
        }}>
          <View>
      <Text style={{ fontWeight: 'bold', fontSize: 25, color: 'black' }}>{item.name}</Text>
      <Text style={{ paddingVertical: 5, color: 'black' }}>{item.address}</Text>
      <Text style={{ paddingVertical: 5, color: 'black' }}>Appointment Date: {item.appointmentDate.toDate().toLocaleDateString()}</Text>
      <Text style={{ paddingVertical: 5, color: 'black' }}>{item.type}</Text>
      <Text style={{ paddingVertical: 5, color: 'black' }}>Status: {item.status}</Text>
      </View>
      <View style={{position: 'absolute', right: 0}}>
      <FontAwesomeIcon icon={faDroplet} size={55} color="#DE0A1E" />
      <Text style={{color: 'white', position:'absolute', right: 14, marginTop: 14, fontWeight: 'bold'}}>{item.bloodGroup}</Text>
      </View>
      </View>
      {/*<View style={{margin:2, marginTop:4, flex: 1, height: 1, backgroundColor: '#8C8C8C'}} />
      <View style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>

        <TouchableOpacity style={{ alignItems: 'center', backgroundColor: '#00000000', borderRadius: 3, paddingVertical: 8, paddingHorizontal: 50 }}>
          <Text style={{ fontSize: 17, color: '#DE0A1E' }}>{'View Details'}</Text>
        </TouchableOpacity>
      </View>*/}
      {/* <View style={{margin:2, marginTop:4, flex: 1, height: 1, backgroundColor: '#8C8C8C'}} /> */}
    </View>
    );

  };



  return (
    <SafeAreaView style={{ justifyContent: 'center', alignContent: 'center', flex: 1 }}>
      {/* <View style={styles.container}>
            <TouchableOpacity style={styles.backButton}>
                <FontAwesomeIcon icon={faArrowLeft} size={20} color="white" />
            </TouchableOpacity>
            <Text style={styles.title}>{"Blood Banks and Hospitals"}</Text>
            <View style={{ width: 30 }} />
        </View> */}

      <View style={{ flexDirection: 'column', margin: 15, flex: 1, color: 'black' }}>

        <TextInput
          placeholder="Search"
          placeholderTextColor="gray"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={{ borderRadius: 10, borderColor: '#808080', borderWidth: 1, padding: 5, marginBottom: 10, color: 'black' }}
        />

        {isLoading ?
        
          <Text>Loading...</Text>

          :

          <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={true}
          extraData={searchQuery}
        />

      
        }

        

      </View>

    </SafeAreaView>
  );

};

export default AppointmentsList;
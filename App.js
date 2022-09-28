import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View, Button, Alert, Keyboard } from 'react-native';
import * as SQLite from'expo-sqlite';

export default function App() {

const [product, setProduct] = useState('');
const [amount, setAmount] = useState('');
const [shoppings, setShoppings] = useState([]);

const db = SQLite.openDatabase('shoppingdb.db');
//db.transaction(callback, error, success)

useEffect(() => {
  db.transaction(tx => {
    tx.executeSql(`create table if not exists shopping (id integer primary key not null, product text, amount text);`);
  }, null, updateList);
}, []);

const saveProduct = () => {
  db.transaction(tx => {
    tx.executeSql(`insert into shopping (product, amount) values (?, ?);`,
      [product, amount]);
  }, null, updateList)
}

const updateList = () => {
  db.transaction(tx => {
    tx.executeSql(`select * from shopping;`, [], (_, { rows }) => 
    setShoppings(rows._array)
    );
  }, null, null);
}

const deleteProduct = (id) => {
  db.transaction(tx => {
      tx.executeSql(`delete from shopping where id = ?;`, [id]);
    }, null, updateList);
}

const listSeparator = () => {
  return(
    <View
      style={{
        height: 5,
        width: '80%',
        backgroundColor: '#fff',
        marginLeft: '10%'
      }}
    />
  );
};

  return (
    <View style={styles.container}>
      
      <TextInput
        style={ styles.input }
        keyboardType='default'
        onChangeText={ product => setProduct(product) }
        value={ product }
        placeholder='Product'
      />

      <TextInput
        style={ styles.input }
        keyboardType='default'
        onChangeText={ amount => setAmount(amount) }
        value={ amount }
        placeholder='Amount'
      />

      <View style={ styles.button }>
        <Button title='SAVE'
          onPress={ saveProduct } 
        />
      </View>

      <Text style={{ fontSize: 18, marginTop: 3 }}>
        Shopping list
      </Text>

      <FlatList
        style={ styles.list }
        keyExtractor={ item => item.id.toString() }
        renderItem={ ({ item }) => 
        <View style={ styles.listcontainer }>
          <Text>
            { item.product }
            <Text>, </Text>
            { item.amount }
          </Text>
          <Text style={{ color: '#0000ff' }} 
            onPress={() => deleteProduct(item.id)}> Bought</Text>
            </View> }
      data={ shoppings }
      ItemSeparatorComponent={ listSeparator }
    />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 20
  },
  input : {
    width: '80%',
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 3,
    marginTop: 3,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
button : {
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'lightblue',
    margin: 5,
    borderColor: 'black',
    borderWidth: 1,
    width: '20%',
    height: 40
  },
text : {
  color: 'black',
  fontSize: 20,
  marginBottom: 4,
  },
list : {
  fontSize: 20,
  textAlign: 'center',
  marginTop: 20
  },
listcontainer : {
  flexDirection: 'row',
  backgroundColor: '#fff',
  alignItems: 'center'
},
});

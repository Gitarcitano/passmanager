import React, { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { SearchBar } from '../../components/SearchBar';
import { LoginDataItem } from '../../components/LoginDataItem';

import {
  Container,
  LoginList,
  EmptyListContainer,
  EmptyListMessage
} from './styles';
import { LoginDataProps } from './interface';



export function Home() {
  const [searchListData, setSearchListData] = useState<LoginDataProps[]>([]);
  const [data, setData] = useState<LoginDataProps[]>([]);
  const storageKey = '@passmanager:logins';

  async function loadData() {
    try {
      const response = await AsyncStorage.getItem(storageKey);

      if(!response) return;

      const currentData = response ? JSON.parse(response) : [];
    
      setSearchListData(currentData);
      setData(currentData);
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(useCallback(() => {
    loadData();
  }, []));

  function handleFilterLoginData(search: string) {
    if(search){
      const flitteredData = data.filter(item => item.title.includes(search));

      if(flitteredData) {
        setSearchListData(flitteredData);
      }
    } else {
      setSearchListData(data);
    }
  }

  return (
    <Container>
      <SearchBar
        placeholder="Pesquise pelo nome do serviço"
        onChangeText={(value) => handleFilterLoginData(value)}
      />

      <LoginList
        keyExtractor={(item) => item.id}
        data={searchListData}
        ListEmptyComponent={(
          <EmptyListContainer>
            <EmptyListMessage>Nenhum item a ser mostrado</EmptyListMessage>
          </EmptyListContainer>
        )}
        renderItem={({ item: loginData }) => {
          return <LoginDataItem
            title={loginData.title}
            email={loginData.email}
            password={loginData.password}
          />
        }}
      />
    </Container>
  )
}
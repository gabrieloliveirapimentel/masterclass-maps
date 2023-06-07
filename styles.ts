import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  map: {
    width: '100%',
    flexGrow: 1
  },
  marker: {
    width: 32,
    height: 32,
    backgroundColor: 'red',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  }, 
  searchContainer: {
    position: 'absolute',
    zIndex: 1,
    width: '90%',
    top: 44
  },
  searchInput: {
    height: 56,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#555'
  },
  buttonContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
});

import { SafeAreaProvider,SafeAreaView } from 'react-native-safe-area-context';
import {
 View, Text,Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LoginScreen } from './screens/LoginScreen';
import{InscriptionScreen}  from './screens/InscriptionScreen'
import styles from './AppStyles';
import { useState, useEffect} from 'react';
import { initDb,listerProduits } from './database' 
import { ProduitsScreen } from './screens/ProduitsScreen';



export default function App() {

  const [ecran, setEcran] = useState('login');
  const [utilisateur, setUtilisateur] = useState(null);

  useEffect(() => {
    (async () => {
      await initDb();
      const produits = await listerProduits();
      console.log('Nombre de produits :', produits.length);
      console.log(produits[0]);
    })();
  }, []);


  //  Utilisateur connecté : écran de bienvenue

  // if(utilisateur){
  //   return(
  //     <>

  //       <SafeAreaProvider>
  //         <StatusBar style="dark" />
  //         <SafeAreaView style={styles.racine}>
  //           <View style={styles.bienvenue}>
  //             <Text style={styles.titreBienvenue}>
  //               Bonjour {utilisateur.prenom} {utilisateur.nom}
  //             </Text>

  //             <Text style={styles.texte}>{utilisateur.email}</Text>

  //             <Pressable
  //               onPress={() => setUtilisateur(null)}
  //               style={({ pressed }) => [styles.bouton, pressed && styles.boutonPresse]}
  //             >
  //               <Text style={styles.boutonTexte}>Se déconnecter</Text>
  //             </Pressable>

  //           </View>
  //         </SafeAreaView>
          
  //     </SafeAreaProvider>

  //     </>
  //   )
  // }

  // Personne n'est connecté : connexion ou inscription

  // return (
  //   <>

  //     <SafeAreaProvider>
  //       <StatusBar style="dark" />
  //       <View style={styles.racine}>
  //         <View style={styles.ecran}>
  //           {
  //             ecran === 'login'
  //               ?  <LoginScreen onConnecte={setUtilisateur} />
  //               : <InscriptionScreen />
  //           }

            
  //         </View>

  //         <SafeAreaView edges={['bottom']} style={styles.zoneLien}>
  //           <Pressable onPress={() => setEcran(ecran === 'login' ? 'inscription' : 'login')}>
  //             <Text style={styles.lien}>
  //               {
  //                 ecran === 'login'
  //                   ? "Pas encore de compte ? S'inscrire"
  //                   : 'Déjà inscrit ? Se connecter'
  //               }
  //             </Text>
  //           </Pressable>
  //         </SafeAreaView>
  //       </View>
        
  //     </SafeAreaProvider>
  //   </>
  // );




  //afficher les produits 
  if(utilisateur){
    return(
      <>
        <SafeAreaProvider>
          <StatusBar style="dark" />
          <ProduitsScreen 
            utilisateur={utilisateur}
            onDeconnexion={() => setUtilisateur(null)}
          />

        </SafeAreaProvider>
      </>
    )

  }

  // Personne n'est connecté : connexion ou inscription
  // affichage catalogue :
  return(
    <>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <View style={styles.ecran}>
          {
            ecran === 'login'
            ? <LoginScreen onConnecte={setUtilisateur} />
            : <InscriptionScreen />
          }
        </View>
        <SafeAreaView edges={['bottom']} style={styles.zoneLien}>
          <Pressable onPress={() => setEcran(ecran === 'login' ? 'inscription' : 'login')}>
            <Text style={styles.lien}>
              {
                ecran === 'login'
                ? "Pas encore de compte ? S'inscrire"
                : 'Déjà inscrit ? Se connecter'
              }
            </Text>
          </Pressable>
        </SafeAreaView>
      </SafeAreaProvider>
    </>
  )
  

}



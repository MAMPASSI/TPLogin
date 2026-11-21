import { useState, useEffect } from 'react';
import {
 View, Text, TextInput, Switch, Pressable, ScrollView,
 KeyboardAvoidingView,Platform, Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './InscriptionStyles';

import { initDb, insererUtilisateur, listerUtilisateurs } from '../database';
import {validerFormulaire} from "../utils/validation"

export const InscriptionScreen = () =>{
    const FORMULAIRE_VIDE = {
        nom: '', prenom: '', email: '', telephone: '', mdp: '', confirmation: '',
    };
    const [form, setForm] = useState(FORMULAIRE_VIDE)
    const [newsletter, setNewsletter] = useState(false);
    const [cgu, setCgu] = useState(false);
    const [erreurs, setErreurs] = useState({});

    const maj = (champ, valeur) => setForm((f) => ({ ...f, [champ]: valeur }));

    const valider = () => {
        const e = validerFormulaire(form, cgu);
        setErreurs(e);
        return Object.keys(e).length === 0;
    };


    const envoyer = async () => {
        if (!valider()) return;
        try {
            await insererUtilisateur({ ...form, newsletter, cgu });
            Alert.alert('Inscription réussie', `Bienvenue ${form.prenom} ${form.nom} !`);
            // Vérification dans le terminal
            console.log(await listerUtilisateurs());
            // Remise à zéro du formulaire
            setForm(FORMULAIRE_VIDE);
            setNewsletter(false);
            setCgu(false);
            setErreurs({});
        } catch (e) {
            if (String(e.message).includes('UNIQUE')) {
                setErreurs({ email: 'Cet email est déjà utilisé' });
            } else {
                Alert.alert('Erreur', "Impossible d'enregistrer l'utilisateur");
            }
            console.log(e);
        }
    };


    

    useEffect(() => {
        initDb().catch((e) => console.log('Erreur init base', e));
    }, []);




    return (
        <>
        <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
            >
                <ScrollView contentContainerStyle={styles.contenu} keyboardShouldPersistTaps="handled">
                    <Text style={styles.titre}>Créer un compte</Text>

                    {/* Les champs viendront ici */}
                    <View style={styles.groupe}>
                        <Text style={styles.label}>Nom</Text>
                        <TextInput
                        style={[styles.champ, erreurs.nom && styles.champErreur]}
                        placeholder="Dupon"
                        placeholderTextColor="#9CA3AF"
                        autoCapitalize="words"
                        value={form.nom}
                        onChangeText={(t) => maj('nom', t)}
                    />
                        {erreurs.nom && <Text style={styles.erreur}>{erreurs.nom}</Text>}
                    </View>
                    <View style={styles.groupe}>
                        <Text style={styles.label}>Prenom</Text>
                        <TextInput
                        style={[styles.champ, erreurs.prenom && styles.champErreur]}
                        placeholder="Marie"
                        placeholderTextColor="#9CA3AF"
                        autoCapitalize="words"
                        value={form.prenom}
                        onChangeText={(t) => maj('prenom', t)}
                    />
                        {erreurs.prenom && <Text style={styles.erreur}>{erreurs.prenom}</Text>}
                    </View>

                    <View style={styles.groupe}>
                        <Text style={styles.label}>Telephone</Text>
                        <TextInput
                        style={[styles.champ, erreurs.telephone && styles.champErreur]}
                        placeholder="0758239879"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="phone-pad"
                        autoCapitalize="words"
                        value={form.telephone}
                        onChangeText={(t) => maj('telephone', t)}
                    />
                        {erreurs.telephone && <Text style={styles.erreur}>{erreurs.telephone}</Text>}
                    </View>

                    <View style={styles.groupe}>
                        <Text style={styles.label}>E-mail</Text>
                        <TextInput
                        style={[styles.champ, erreurs.email && styles.champErreur]}
                        placeholder="test@gmail.com"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="email-address"
                        autoCorrect={false}
                        autoCapitalize="none"

                        value={form.email}
                        onChangeText={(t) => maj('email', t)}
                    />
                        {erreurs.nom && <Text style={styles.erreur}>{erreurs.email}</Text>}
                    </View>

                    <View style={styles.groupe}>
                        <Text style={styles.label}>Mot de passe</Text>
                        <TextInput
                        style={[styles.champ, erreurs.mdp && styles.champErreur]}
                        placeholder="Entrez votre mot de passe"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry
                        autoCapitalize="words"
                        value={form.mdp}
                        onChangeText={(t) => maj('mdp', t)}
                    />
                        {erreurs.nom && <Text style={styles.erreur}>{erreurs.mdp}</Text>}
                    </View>

                    <View style={styles.groupe}>
                        <Text style={styles.label}>Confirmation de mot de passe</Text>
                        <TextInput
                        style={[styles.champ, erreurs.confirmation && styles.champErreur]}
                        placeholder="Confirmer votre mot de passe"
                        placeholderTextColor="#9CA3AF"
                        autoCapitalize="words"
                        secureTextEntry
                        value={form.confirmation}
                        onChangeText={(t) => maj('confirmation', t)}
                    />
                        {erreurs.confirmation && <Text style={styles.erreur}>{erreurs.confirmation}</Text>}
                    </View>




                    <View style={styles.ligneSwitch}>
                        <Text style={styles.libelle}>Recevoir la newsletter</Text>
                        <Switch value={newsletter} onValueChange={setNewsletter} />
                    </View>


                    <View style={styles.ligneSwitch}>
                        <Text style={styles.libelle}>J'accepte les CGU</Text>
                        <Switch value={cgu} onValueChange={setCgu} />
                    </View>

                    {erreurs.cgu && <Text style={styles.erreur}>{erreurs.cgu}</Text>}

                    <Pressable
                        onPress={envoyer}
                        style={({ pressed }) => [styles.bouton, pressed && styles.boutonPresse]}
                    >
                        <Text style={styles.boutonTexte}>S'inscrire</Text>
                    </Pressable>

                    




                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>


        </>
    )
}
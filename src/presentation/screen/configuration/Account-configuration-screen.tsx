import React, { useContext, useEffect, useState } from 'react'
import { View, StyleSheet, useWindowDimensions, ScrollView, ActivityIndicator } from 'react-native';
import { ButtonConfiguration } from '../../components/buttonConfiguration'
import { Text } from 'react-native-paper';
import { GlobalStyles } from '../../styles/globalStyles';
import { authStore } from '../../store/auth/auth-store';
import { Buttons } from '../../components/buttons';
import { AlterStore } from '../../store/alter/alterUser';
import { ChangePersonalConfiguraton } from '../../../core/use-cases/users/change-personal-configuration';
import { WeConnectFetcher } from '../../../config/adapters/weConnectFetcher';
import { uiStore } from '../../store/ui/ui-store';
import { ThemeContext } from '../../context/themeContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { User } from '../../../core/entities/user-entities';
import { TransformVariable } from '../../../helpers/transformVariable';
import { HamburgerMenu } from '../../components/hamburgerMenu';
import Dialog from 'react-native-dialog';
import { ProfilePhotoPickerModal } from '../../components/modals/configuration/profilePhotoPickerModal';
import { PasswordModal } from '../../components/modals/configuration/passwordModal';

export const AccountConfiguration = () => {
  const { colors } = useContext(ThemeContext);

  const user = AlterStore(state => state.user);
  const IsAlterFalse = AlterStore(state => state.IsAlterFalse)
  const TooglePasswordModal = uiStore(state => state.TooglePasswordModal)
  const TooglePhotoPickerModal = uiStore(state => state.TooglePhotoPickerModal)
  const IsAlterTrue = AlterStore(state => state.IsAlterTrue);
  const setUserAlterated = AlterStore(state => state.setUserAlterated);

  const [userState, setUserState] = useState<User>();


  useEffect(() => {
    if (userState && userState !== user) {
      setUserAlterated(userState);
    }
  }, [userState]);

  useEffect(() => {
    if (user && user !== userState) {
      setUserState(user);
    }
  }, [user]);


  const EnviarCambio = (nombre: string, valor: string) => {
    console.log(nombre, valor)
    const result = nombre.split(' ').slice(2).join(' ');

    const variable = TransformVariable(result);
    if (variable) {
      setUserState(prevUserState => {
        if (!prevUserState) return undefined;
        IsAlterTrue();

        return {
          ...prevUserState,
          [variable]: valor
        };
      });
    }
  };
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const onChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setShow(false);
      setDate(selectedDate);


      EnviarCambio('Fecha nacimiento: ', selectedDate.toISOString());
    } else {

      setShow(false);
    }
  };

  const botonListPersonal = [
    { text: 'Nombre: ', isLast: false, icon: 'person-outline', data: user?.Name },
    { text: 'Apellido: ', isLast: false, icon: 'person-outline', data: user?.LastName },
    { text: 'Genero: ', isLast: false, icon: 'remove-outline', data: user?.genero },
    {
      text: 'Fecha nacimiento: ', isLast: true, icon: 'calendar-outline', metodo: () => setShow(true),
      data: user?.fechaNacimiento ? new Date(user.fechaNacimiento).toLocaleDateString() : ''
    },


  ]

  const botonListCuenta = [


    { text: 'Foto de perfil', isLast: false, icon: 'camera-outline', metodo: TooglePhotoPickerModal },
    { text: 'Contraseña', isLast: true, icon: 'lock-closed-outline', metodo: TooglePasswordModal },

  ]

  const botonListContacto = [


    { text: 'DisplayName: ', isLast: false, icon: 'id-card-outline', data: user?.DisplayName },
    { text: 'Email: ', isLast: false, icon: 'mail-outline', data: user?.Email },
    { text: 'numero de telefono: ', isLast: true, icon: 'call-outline', data: user?.numeroDeTelefono },

  ]


  const { height, width } = useWindowDimensions()
  const [isLoading, setIsLoading] = useState(false);
  const isAlter = AlterStore(state => state.isAlter)
  const setLogged = authStore(state => state.setLogged)
  const dialogMode = uiStore(state => state.dialogMode)
  const configDialogMode = uiStore(state => state.configDialogMode)
  const saveUserConfiguration = async () => {
    if (user) {
      setIsLoading(true)
      const resp = await ChangePersonalConfiguraton(WeConnectFetcher, user, user.uid)
      if (resp.ok) {
        setLogged(user);
        IsAlterFalse()
      }
    }
    setIsLoading(false)
  }
  const [valorPrompt, setValorPrompt] = useState('');


  const handleCancel = () => {
    configDialogMode(false, ``)

  };

  const handleOK = () => {
    EnviarCambio(dialogMode.msg, valorPrompt)
    configDialogMode(false, ``)
    setValorPrompt('')
  };



  return (
    <>
      {isLoading ?
        <>
          <ActivityIndicator style={{ top: height / 2, left: width / 2, position: 'absolute' }} />
        </> :

        <View style={{ flex: 1, backgroundColor: colors.background }}>



          <View style={[GlobalStyles.globalMargin, { flex: 1, overflow: 'hidden', }]}>
            <Dialog.Container visible={dialogMode.visible}>
              <Dialog.Title>{dialogMode.msg}</Dialog.Title>

              <Dialog.Input
                placeholder="Respuesta..."
                value={valorPrompt}
                onChangeText={setValorPrompt}
              />
              <Dialog.Button label="Cancel" onPress={handleCancel} />
              <Dialog.Button label="OK" onPress={handleOK} />
            </Dialog.Container>
            <HamburgerMenu />
            <ProfilePhotoPickerModal />
            <PasswordModal />

            {
              show &&
              <DateTimePicker
                value={date}
                mode='date'
                is24Hour={true}
                display="default"
                onChange={onChange}
              />
            }
            <ScrollView style={{ marginTop: 20 }}>

              <Text variant='bodyLarge' style={{ fontSize: 24, color: colors.text }}>Personal</Text>
              <View style={[styles.configurationBox, { width, backgroundColor: colors.background }]}>
                {botonListPersonal.map((b, index) => <ButtonConfiguration key={index} text={b.text} isLast={b.isLast} icon={b.icon} data={b.data} metodo={b.metodo} />)}
              </View>

              <View style={[styles.configurationBox, { width, marginTop: 20, marginBottom: 20 }]}>
                <Text variant='bodyLarge' style={{ fontSize: 24, fontWeight: 'bold' }}>Cuenta</Text>
                {botonListCuenta.map((b, index) => <ButtonConfiguration key={index} text={b.text} isLast={b.isLast} icon={b.icon} metodo={b.metodo} />)}
              </View>
              <Text variant='bodyLarge' style={{ fontSize: 24, fontWeight: 'bold' }}>Contacto</Text>

              <View style={[styles.configurationBox, { width }]}>
                {botonListContacto.map((b, index) => <ButtonConfiguration key={index} text={b.text} isLast={b.isLast} icon={b.icon} data={b.data} />)}

              </View>
            </ScrollView>
            {isAlter ? <>
              <View style={{ flex: 1, height: 200, position: 'absolute', zIndex: 2 }} />
              <Buttons
                text='Guardar'
                onPress={() => saveUserConfiguration()}
                styles={{
                  height: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 20,
                  backgroundColor: colors.primary
                }}
              />
            </>
              : <></>
            }
          </View>
        </View>
      }
    </>
  )
}
const styles = StyleSheet.create({
  configurationBox: {
    height: 'auto',
    borderRadius: 20,
    display: 'flex',
    justifyContent: 'center',
    paddingVertical: 20,
    rowGap: 5
  }

}) 
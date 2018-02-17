import firebase from 'firebase'
import { config } from './firebaseCfg'

export const fire = firebase.initializeApp(config)
export const loginWithGithub = (fire) => {
  return new Promise(async (resolve, reject) => {
    const provider = new firebase.auth.GithubAuthProvider()
    provider.addScope('public_repo')

    try {
      const user = await fire.auth().signInWithPopup(provider)

      return resolve(user)
    } catch (err) {
      return reject(err)
    }
  })
}
export const signOut = (fire) => {
  return new Promise((resolve, reject) => {
    fire.auth().signOut()
      .then(res => resolve(true))
      .catch(err => reject(err))
  })
}

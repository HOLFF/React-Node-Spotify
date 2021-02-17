  
import React, { Component } from 'react';
import './App.css';

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

class App extends Component {
  constructor(){
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (true) {
      spotifyApi.setAccessToken("BQDJ78UMr0ieSfsAFidog_D8Ek41Voco7qM--v6HAdcSKzOWLuiOXHfWKiMDK4CHtYuZo1JNlIICQABD67yHEWGGGr8U2FKTHO_e9zCYVf647b6RhNc6qaRpjVoaQivNqQ7BwvowSiHLqLg_wBEOnIOWye2doVRcmQKXiQLiBVvrVn5AWMqfCchJqPwq&refresh_token=AQA6l1WL8PXv3Xxcav9Bl7-ygFX8-EAp9Ro2nplbyCdffq5mGkyPI8D9Fh1-PX2NbwZZy_S0hcFYiUoni-B2fa7UzpKObZToEFmzXimO1_rmAmZ4KVEB0xC9-Bt9pM5nNbQ");
    }
    this.state = {
      loggedIn:  true,
      nowPlaying: { name: 'Not Checked', albumArt: '' },
      userPlayList: {name: 'Not Checked'},
      playListTracks: {name: 'Not Checked'},
      trackToPlayList: {name: 'Not Checked'}
    }
  }
  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  getNowPlaying(){
    spotifyApi.getMyCurrentPlayingTrack()
      .then((response) => {
        this.setState({
          nowPlaying: { 
              name: response.item.name,
              albumArt: response.item.album.images[0].url
            }
        });
      })
  }

  getPlayLists(){
    spotifyApi.getUserPlaylists()
      .then((response) => {
        this.setState({
          userPlayList: {
              name: response.item.name,
              playList: response.item.name
            }    
        });
      })  
  }

  getTracksOfPlayList(){ 
    spotifyApi.getPlaylistTracks()
      .then((response) => {
        this.setState({
          playListTracks:{
            name:response.item.name,
            tracks: respone.item.name     
            }
        });
      }) 
  }

  addTrackToPlayList(){
    spotifyApi.addTracksToPlaylist()
      .then((response) => {
        this.setState({
          trackToPlayList: {   
              name: response.item.name,
              addedTrackToPlayList: response.item.name
            }    
        });
      })  
  }

  skipToNext(){
  spotifyApi.skipToNext()
  }

  render() {
    return (
      <div className="App">
        <a href='http://localhost:8888' > Login to Spotify </a>
        <div>
          Now Playing: { this.state.nowPlaying.name }
        </div>
        <div>
          <img src={this.state.nowPlaying.albumArt} style={{ height: 150 }}/>
        </div>
        { this.state.loggedIn &&
          <button onClick={() => this.getNowPlaying()}>
            Check Now Playing
          </button>
        }
        { this.state.loggedIn &&
        <button onClick={() => this.skipToNext()}>
          Skip to Next
        </button>
        } 
      </div>
    );
  }
}

export default App;
  
import React, { Component } from 'react';
import './App.css';

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

class App extends Component {
  constructor(){
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: { name: 'Name',albname: 'Album', albumArt: '', arname: 'Artist'},
      userPlaylist: {name: 'Not Checked'},
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
        let artists="";
        response.item.artists.forEach(artist  => {
          artists+=artist.name + ", "             
        });
        artists = artists.slice(0,-2);
        this.setState({
          nowPlaying: { 
              name: response.item.name,
              albname : response.item.album.name,
              albumArt: response.item.album.images[0].url,
              arname: artists
            }
        });
      })
  }

  getPlaylists(){
    spotifyApi.getUserPlaylists()
      .then((response) => {
        this.setState({
          userPlaylist: {
              name: response.items[0].name
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
            tracks: response.item.name     
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
  spotifyApi.skipToNext();
  this.sleep(1000).then(()=>{this.getNowPlaying()})
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  render() {
    return (
      <div className="App">
        <a href='http://localhost:8888' > Login to Spotify </a>
        <div>Currently Playing Song:
          <h1></h1>
          Title: { this.state.nowPlaying.name }
          <br></br>
          <img src={this.state.nowPlaying.albumArt} style={{ height: 150 }}/>
          <br></br>
          From Album: { this.state.nowPlaying.albname }
          <br></br>
          By Artist: { this.state.nowPlaying.arname }
        </div>
        <div>

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
        { this.state.loggedIn &&
        <button onClick={() => this.getPlaylists()}>
          User Playlists
        </button>
        }
         <div>
          User Playlist: { this.state.userPlaylist.name }
        </div>
      </div>
    );
  }
}

export default App;
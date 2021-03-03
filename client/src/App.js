  
import React, { Component } from 'react';
import './App.css';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

class App extends Component {
  constructor(){
    super();
    const plstate = 0;
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: { name: 'Name',albname: 'Album', albumArt: '', arname: 'Artist'},
      userPlaylists: {name1: 'Not Checked', by1: 'Not Checked', cover1:'',
                      name2: 'Not Checked', by2: 'Not Checked', cover2:'', 
                      name3: 'Not Checked', by3: 'Not Checked', cover3:''},
      playListTracks: {name: 'Not Checked'},
      trackToPlayList: {name: 'Not Checked'},
      loadText: {bf:"Discover User Playists"}
      
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
              name: response.items[0].name1
            }    
        });
      })  
  }

  addTracktoQueue(){

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
        <div>
          <h3>Currently Playing Song:</h3>
          Title: { this.state.nowPlaying.name }
          <br></br>
          <img src={this.state.nowPlaying.albumArt} style={{ height: 150 }}/>
          <br></br>
          From Album: { this.state.nowPlaying.albname }
          <br></br>
          By Artist: { this.state.nowPlaying.arname }
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
          User Playlist: { this.state.userPlaylists.name1 }
        </div>
        <Carousel>
                <div>
                    <img src="assets/1.jpeg" />
                    <p className="legend">Legend 1</p>
                </div>
                <div>
                    <img src="assets/2.jpeg" />
                    <p className="legend">Legend 2</p>
                </div>
                <div>
                    <img src="assets/3.jpeg" />
                    <p className="legend">Legend 3</p>
                </div>
        </Carousel>
        { this.state.loggedIn &&
          <button onClick={() => this.getNowPlaying()}>
             {this.state.loadText.bf}
          </button>
        }
      </div>
    );
  }
}

export default App;
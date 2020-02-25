<template>
  <div id="app" class="container p-4">
    <nav class="navbar navbar-light navbar-expand-md">
        <div class="container">
            <a class="navbar-brand" href="#">
                <h1 >Guess the 🌟</h1>
                <h5 >{{currentVersion.name}}</h5>

            </a>
            <button class="navbar-toggler " type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="toggle">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <!-- Left Side Of Navbar -->
                <ul class="navbar-nav mr-auto"></ul>

                <!-- Right Side Of Navbar -->
                <ul class="navbar-nav ml-auto">
                    <!-- Authentication Links -->
                        <li class="nav-item dropdown">
                            <a id="navbarDropdown" class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-pre>
                                Switch to different version<span class="caret"></span>
                            </a>

                            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">

                                <a v-for="version in Versions" v-bind:key="version.name" href="#" class="dropdown-item" v-on:click="switchToVersion(version)" v-bind="{'hidden':currentVersion.name == version.name}">{{version.name}}</a>
                                <!-- <a href="#" class="dropdown-item" v-on:click="switchToUrdu" v-bind="{'hidden':currentVersion == Versions.Urdu}">Urdu Movies</a> -->
                                <!-- <a href="#" class="dropdown-item" v-on:click="switchToMain" v-bind="{'hidden':currentVersion == Versions.Main}">Famous Movies</a> -->
                            </div>
                        </li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="pb-4">
      <span>Your Score: {{score}}</span>
      <input class="btn btn-warning float-right" type="button" v-on:click="getMovies" value="Skip"/>
    </div>

    <MovieItem v-bind:movie="movie"/>
    <br>
    <div class="mx-auto" style="width: 200px;">
      <button class="btn btn-primary" style="width: 200px;height:48px;" v-on:click="getMovies" v-bind:class="{'hidden':!guessMade}">
        Next ></button>
    </div>
    <br>
    <Actors v-bind:actors="actors" v-bind:guessMade="guessMade" v-on:actor-select="actorSelect"/>
    <br><br>
    <div class="mx-auto" style="width: 200px;">
      <button class="btn btn-success" style="width: 200px;height:48px;" v-on:click="guess" v-bind:class="{'hidden':guessMade}">
        Guess!</button>
    </div>
    <div class="mx-auto" style="width: 200px;">
      <button class="btn btn-primary" style="width: 200px;height:48px;" v-on:click="getMovies" v-bind:class="{'hidden':!guessMade}">
        Next ></button>
    </div>
    <Toasts
        :show-progress="false"
        :rtl="false"
        :max-messages="5"
        :time-out="5000"
        :closeable="true"></Toasts>
  </div>
</template>

<script>

import MovieItem from "./components/MovieItem";
import Actors from "./components/Actors";

export default {
  name: 'App',
  components: {
    MovieItem,
    Actors
  },
  data () {
    return {
      score: 0,
      movie: {
          id: 1,
          title: "Birds of prey",
          poster_path: "https://image.tmdb.org/t/p/w500/h4VB6m0RwcicVEZvzftYZyKXs6K.jpg",
          backdrop_path: "https://image.tmdb.org/t/p/w780/h4VB6m0RwcicVEZvzftYZyKXs6K.jpg"
      },
      actors: [],
      cast: [],
      selectedActor: {},

      guessMade: false,

      Versions: {
        Main: {
          name: "Famous Movies",
          url: "https://api.themoviedb.org/3/discover/movie?language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&primary_release_date.lte=2019-12-31&vote_count.gte=1000&vote_average.gte=7.5&with_original_language=en&api_key=",
          pages: 18
        },
        Urdu: {
          name: "Urdu Movies",
          url: "https://api.themoviedb.org/3/discover/movie?language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&primary_release_date.lte=2019-12-31&vote_count.gte=2&vote_average.gte=6&with_original_language=ur&api_key=",
          pages: 3
        },
        Hindi: {
          name: "Bollywood Movies",
          url: "https://api.themoviedb.org/3/discover/movie?language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&primary_release_date.lte=2019-12-30&vote_count.gte=50&vote_average.gte=7&with_original_language=hi&api_key=",
          pages: 5
        },
        Punjabi: {
          name: "Punjabi Movies",
          url: "https://api.themoviedb.org/3/discover/movie?language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&primary_release_date.lte=2019-12-30&vote_count.gte=2&vote_average.gte=5&with_original_language=pa&api_key=",
          pages: 3
        }
      },
      currentVersion: {}
    }
  },
  mounted () {
      this.currentVersion = this.Versions.Main;
      this.getMovies();
  },
  methods: {
    getMovies () {
      this.guessMade = false;
      this.selectedActor = null;

      var randomPage = Math.floor(Math.random() * this.currentVersion.pages) + 1 // total number of pages for this query
      this.axios
        .get(this.currentVersion.url + process.env.VUE_APP_TMDB_KEY + '&page=' + randomPage)
        .then(response => {
          var moviePos = Math.floor(Math.random() * response.data.results.length);
          this.movie = response.data.results [moviePos];
          response.data.results.splice (moviePos, 1);
          this.getActors(this.movie.id, response.data.results.slice (1, 10));
        });
    },
    
    getActors (movieId, otherMovies) {
      this.actors = [];
      this.axios
        .get(' https://api.themoviedb.org/3/movie/' + movieId + '/credits?&api_key=' + process.env.VUE_APP_TMDB_KEY)
        .then(response => {
          this.cast = response.data.cast;
          this.actors.push (response.data.cast[0]);
          this.actors.push (response.data.cast[1]);
          this.actors.push (response.data.cast[2]);
          otherMovies.forEach(element => {
            this.getOtherActors (element.id);
          });
        });
    },

  getOtherActors (movieId) {
    const self = this;
    this.axios
      .get(' https://api.themoviedb.org/3/movie/' + movieId + '/credits?&api_key=' + process.env.VUE_APP_TMDB_KEY)
      .then(response => {
        response.data.cast.some(element => {
          if (this.actors.filter(actor => element.id == actor.id).length == 0) {
            self.actors.push (element);
            self.shuffle (self.actors);
            return true;
          }
          return false;
        });
      });
    },

    actorSelect (actor) {
      this.actors.forEach(element => {
        element.isSelected = false;
        element.name = element.name + " ";
        if (element.id == actor.id) {
          element.isSelected = true;
          element.name = element.name + " ";
          this.selectedActor = element;
        }
      });
    },

    guess () {
      if (this.selectedActor == null) {
        this.$toast.warning('Nothing selected!');
        console.log ("Nothing selected!");
        return;
      }

      var correct = false;

      this.cast.forEach(element => {
        if (element.id == this.selectedActor.id) {
          this.score += 1000;
          this.celeberate ();
          this.$toast.success('Correct! +1000');
          console.log ("Guessed Corretly!");
          correct = true;

          this.cast.forEach(element => {
          element.isCorrect = true;
        });
        }
      });

      if (!correct) {
        this.score -= 1000;
        this.$toast.error('Wrong! -1000');
        this.playSound ('http://soundbible.com/grab.php?id=1830&type=mp3');
        console.log ("Guessed wrong!");

        this.cast.forEach(element => {
          element.isCorrect = true;
        });
      }

      this.guessMade = true;
    },

    celeberate() {
      this.$confetti.start();
      this.playSound('http://soundbible.com/grab.php?id=1003&type=mp3');
      setTimeout(() => {
          this.$confetti.stop();
      }, 4000);
      this.$confetti.update({
        particles: [
          {
            type: 'heart',
          },
          {
            type: 'circle',
          },
          {
            type: 'rect',
          },
        ],
      });
    },

    playSound (sound) {
      if(sound) {
        var audio = new Audio(sound);
        audio.play();
      }
    },

    shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    },

    switchToVersion (version) {
      this.currentVersion = version;
      this.getMovies();
    }
  }
}

</script>

<style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  .text-center {
    text-align: center;
  }
  body {
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.4;
  }
  .hidden {
    display: none;
  }
</style>

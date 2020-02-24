<template>
  <div id="app" class="container p-4">
    <h1 class="title">Guess the 🌟</h1>

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

      guessMade: false
    }
  },
  mounted () {
      this.getMovies();
  },
  methods: {
    getMovies () {
      this.guessMade = false;
      this.selectedActor = null;

      var randomPage = Math.floor(Math.random() * 3) + 1 // 3 are the total number of pages for this query
      this.axios
        .get('https://api.themoviedb.org/3/discover/movie?language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&primary_release_date.lte=2019-12-31&vote_count.gte=2&vote_average.gte=6&with_original_language=ur&api_key=' + process.env.VUE_APP_TMDB_KEY + '&page=' + randomPage)
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
          this.$toast.success('Correct! +1000');
          console.log ("Guessed Corretly!");
          correct = true;
        }
      });

      if (!correct) {
        this.score -= 1000;
        this.$toast.error('Wrong! -1000');
        console.log ("Guessed wrong!");

        this.cast.forEach(element => {
          element.isCorrect = true;
        });
      }

      this.guessMade = true;
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
  .title {
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

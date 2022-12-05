<template>
    <div>
        Movies: 
        <div v-for="movie in movies" v-bind:key="movie.id">
            <MovieItem v-bind:movie="movie"></MovieItem>
        </div>
    </div>
</template>

<script>

import MovieItem from "./MovieItem";

export default {
    name: "Movies",
    components: {
        MovieItem
    },
    props: [
        "movies"
    ]
}
</script>

<style scoped>

</style>
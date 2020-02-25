<template>
    <div class="movie-item card">
        <div class="background-image" :style="{ backgroundImage: `url('${'https://image.tmdb.org/t/p/w780/' + movie.backdrop_path}')` }"></div>
        <div class="row">
            <div class="col-auto">
                <img class="card-image" v-bind:src="'https://image.tmdb.org/t/p/w500/' + movie.poster_path" alt="image" width="180px" height="260px">
            </div>
            <div class="col">
                <div class=" card-body">
                    <img class="float-right" height="40px" src="https://www.themoviedb.org/assets/2/v4/logos/408x161-powered-by-rectangle-blue-10d3d41d2a0af9ebcb85f7fb62ffb6671c15ae8ea9bc82a2c6941f223143409e.png">
                    <h3 class="card-title">{{movie.title}}</h3>
                    <p class="card-text float-none">{{movie.overview}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "MovieItem",
    props: [
        "movie"
    ]
}
</script>

<style scoped>
    .background-image {
        width: 100%;
        height: 100%;
        opacity: 0.25 !important;
        position: absolute;
        top: 0;
        left: 0;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: cover;
    }
    .card-text {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 6;
    }
</style>
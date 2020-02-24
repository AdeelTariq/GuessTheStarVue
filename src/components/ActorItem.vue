<template>
    <div>
        <div @click="$emit('actor-select', actor)" class="card" v-bind:class="{'selected':actor.isSelected,'correct':actor.isCorrect}" >
            <img class="card-image"  alt=" "
                :style="{ backgroundImage: `url('${'https://image.tmdb.org/t/p/w500/' + actor.profile_path}')` }"
                v-bind:class="{'hidden':!guessMade}" height="200px">
            <div class="card-body">
                <div class="card-title">{{actor.name}}</div>
                <div class="card-text font-weight-bold" v-bind:class="{'hidden':!guessMade}">Played {{actor.character}}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ActorItem",
    props: [
        "actor",
        "guessMade"
    ]
}
</script>

<style scoped>
    .card :hover {
        background-color: peachpuff
    }
    .selected {
        background-color: orange !important
    }
    .correct {
        background-color: forestgreen !important
    }
    .hidden {
        display: none;
    }
    .card-image {
        background-position: center center;
        background-repeat: no-repeat;
        background-size: cover;
    }
</style>
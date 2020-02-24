<template>
    <div>
        <span>
            Which of these was the star of this movie?
        </span>
        <div class="row mt-2" v-bind:class="{'hidden':actors.length < 10}">
            <div class="col-xs-12 col-sm-4 col-md-3 col-lg-2 my-2" v-for="actor in actors" v-bind:key="actor.id">
                <ActorItem v-bind:actor="actor" v-bind:guessMade="guessMade" v-on:actor-select="$emit('actor-select', actor)"/>
            </div>
        </div>
    </div>
</template>

<script>

import ActorItem from "./ActorItem";

export default {
    name: "Actors",
    components: {
        ActorItem
    },
    props: [
        "actors",
        "guessMade"
    ]
}
</script>

<style scoped>
    .hidden {
        opacity: 0;
    }
</style>
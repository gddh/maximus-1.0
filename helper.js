const firstEntity = (entities, entity) => {
    const val = entities && entities[entity] && Array.isArray(entities[entity]) &&
        entities[entity].length > 0 && entities[entity][0];
    if (!val) {
        return null;
    }
    return val;
}

const getDuration = (entities) => {
    const duration = firstEntity(entities, 'duration');
    if (duration) {
        return duration.normalized.value * 1000;
    } else {
        return null;
    }
}

module.exports = {
    firstEntity : firstEntity,
    getDuration : getDuration
}

const { Router } = require("express");
const { getAll, getById, searchPlanets } = require("../services/planetService");

const catalogRouter = Router();

catalogRouter.get('/catalog', async (req, res) => {
    const planets =  await getAll();
    res.render('catalog', { planets });
});

catalogRouter.get('/catalog/:id', async (req, res) => {
    const planet = await getById(req.params.id);

    if (!planet) {
        res.render('404');
    }

    const isOwner = req.user?._id == planet.author.toString();
    const hasLiked = Boolean(planet.likedList.find(l => req.user?._id == l.toString()));

    res.render('details', { planet, isOwner, hasLiked });
});

catalogRouter.get('/search', async (req, res) => {
    const { name, solarSystem } = req.query;

    const planets = await searchPlanets(name, solarSystem);

    res.render('search', { data: { name, solarSystem }, planets });
});

module.exports = { catalogRouter };
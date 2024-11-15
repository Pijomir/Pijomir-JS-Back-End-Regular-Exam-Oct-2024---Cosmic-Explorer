const { Router } = require("express");
const { body, validationResult } = require("express-validator");

const { create, deleteById, likePlanet, getById, update } = require("../services/planetService");
const { isUser } = require("../middlewares/guards");
const { parseError } = require("../util");

const planetRouter = Router();

planetRouter.get('/create', isUser(), (req, res) => {
    res.render('create');
});

planetRouter.post('/create', isUser(),
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
    body('age').trim().isFloat({ min: 0 }).withMessage('Age must be a positive number'),
    body('solarSystem').trim().isLength({ min: 2 }).withMessage('Solar system must be at least 2 characters long'),
    body('type').trim(),
    body('moons').trim().isInt({ min: 0 }).withMessage('Moons must be a positive number'),
    body('size').trim().isFloat({ min: 0 }).withMessage('Size must be a positive number'),
    body('rings').trim(),
    body('description').trim().isLength({ min: 10, max: 100 }).withMessage('Description must be between 10 and 100 characters long'),
    body('image').trim().isURL({ require_tld: false, require_protocol: true }).withMessage('URL must be valid'),
    async (req, res) => {
        const userId = req.user._id;

        try {
            const validation = validationResult(req);

            if (validation.errors.length) {
                throw validation.errors;
            }

            await create(req.body, userId);

            res.redirect('/catalog');
        } catch (err) {
            res.render('create', { data: req.body, errors: parseError(err).errors });
        }
    }
);

planetRouter.get('/edit/:id', isUser(), async (req, res) => {
    const id = req.params.id;

    const planet = await getById(id);

    if (!planet) {
        res.status(404).render('404');
        return;
    }

    if (planet.author.toString() != req.user._id) {
        res.redirect('/login');
    }

    res.render('edit', { data: planet });
});

planetRouter.post('/edit/:id', isUser(),
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
    body('age').trim().isFloat({ min: 0 }).withMessage('Age must be a positive number'),
    body('solarSystem').trim().isLength({ min: 2 }).withMessage('Solar system must be at least 2 characters long'),
    body('type').trim(),
    body('moons').trim().isInt({ min: 0 }).withMessage('Moons must be a positive number'),
    body('size').trim().isFloat({ min: 0 }).withMessage('Size must be a positive number'),
    body('rings').trim(),
    body('description').trim().isLength({ min: 10, max: 100 }).withMessage('Description must be between 10 and 100 characters long'),
    body('image').trim().isURL({ require_tld: false, require_protocol: true }).withMessage('URL must be valid'),
    async (req, res) => {
        const userId = req.user._id;
        const planetId = req.params.id;

        try {
            const validation = validationResult(req);

            if (validation.errors.length) {
                throw validation.errors;
            }

            await update(planetId, req.body, userId);

            res.redirect('/catalog/' + planetId);
        } catch (err) {
            res.render('edit', { data: req.body, errors: parseError(err).errors });
        }
    }
);

planetRouter.get('/like/:id', isUser(), async (req, res) => {
    const planetId = req.params.id;
    const userId = req.user._id;

    try {
        await likePlanet(planetId, userId);

        res.redirect('/catalog/' + planetId);
    } catch (err) {
        res.redirect('/');
    }
});

planetRouter.get('/delete/:id', isUser(), async (req, res) => {
    const id = req.params.id;

    try {
        await deleteById(id, req.user._id);
    } catch (err) {
        if (err.message == 'Access denied') {
            res.redirect('/login');
            return;
        }
    }

    res.redirect('/catalog');
});

module.exports = { planetRouter };
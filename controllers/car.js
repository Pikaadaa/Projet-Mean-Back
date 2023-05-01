// Import du modèle student
var Car = require("../models/car");

// Import de express-validator
const { param, body, validationResult } = require("express-validator");

// Déterminer les règles de validation de la requête
const carValidationRules = () => {
    return [
        body("brand")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("Brand name must be specified.")
            .isAlphanumeric()
            .withMessage("Brand name has non-alphanumeric characters."),

        body("nationality")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("Nationality name must be specified.")
            .isAlphanumeric()
            .withMessage("Nationality name has non-alphanumeric characters."),

        body("dateOfCreation", "Invalid date of creation")
            .optional({ checkFalsy: true })
            .isISO8601()
            .toDate()
    ]
}

const paramIdValidationRule = () => {
    return [
        param("id")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("Id must be specified.")
            .isNumeric()
            .withMessage("Id must be a number.")
    ]
};

const bodyIdValidationRule = () => {
    return [
        body("id")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("Id must be specified.")
            .isNumeric()
            .withMessage("Id must be a number.")
    ]
};

// Méthode de vérification de la conformité de la requête  
const checkValidity = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

    return res.status(400).json({
        errors: extractedErrors,
    })
}

// Create
exports.create = [bodyIdValidationRule(), carValidationRules(), checkValidity, (req, res, next) => {

    // Création de la nouvelle instance de student à ajouter 
    var car = new Car({
        _id: req.body.id,
        brand: req.body.brand,
        nationality: req.body.nationality,
        dateOfCreation: req.body.dateOfCreation,
    });

    // Ajout de student dans la bdd 
    car.save(function (err) {
        if (err) {
            return res.status(500).json(err);
        }
        return res.status(201).json("Car created successfully !");
    });
}];

// Read
exports.getAll = (req, res, next) => {
    Car.find(function (err, result) {
        if (err) {
            return res.status(500).json(err);
        }
        return res.status(200).json(result);
    });
};

exports.getById = [paramIdValidationRule(), checkValidity, (req, res, next) => {
    Car.findById(req.params.id).exec(function (err, result) {
        if (err) {
            return res.status(500).json(err);
        }
        return res.status(200).json(result);
    });
}];

// Update
exports.update = [paramIdValidationRule(), carValidationRules(), checkValidity, (req, res, next) => {

    // Création de la nouvelle instance de student à modifier 
    var car = new Car({
        _id: req.body.id,
        brand: req.body.brand,
        nationality: req.body.nationality,
        dateOfCreation: req.body.dateOfCreation,
    });

    Car.findByIdAndUpdate(req.params.id, car, function (err, result) {
        if (err) {
            return res.status(500).json(err);
        }
        if (!result) {
            res.status(404).json("Car with id " + req.params.id + " is not found !");
        }
        return res.status(201).json("Car updated successfully !");
    });
}];

// Delete
exports.delete = [paramIdValidationRule(), checkValidity, (req, res, next) => {
    Car.findByIdAndRemove(req.params.id).exec(function (err, result) {
        if (err) {
            return res.status(500).json(err);
        }
        if (!result) {
            res.status(404).json("Car with id " + req.params.id + " is not found !");
        }
        return res.status(200).json("Car deleted successfully !");
    });
}];
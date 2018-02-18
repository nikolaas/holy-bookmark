export function getCurrentUser(req, res, next) {
    res.json(req.user);
}

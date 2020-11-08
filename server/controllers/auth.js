exports.signup =  (req, res) => {
    console.log('REQ BOD: ', req.body)
    res.json({
        success: true,
        data: 'Signup endpoint',
    });
}
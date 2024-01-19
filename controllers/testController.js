// testController.js
const testController1 = (req, res) => {
    const { name } = req.body;
    res.status(200).send(`<h1>Hello World from Job App Portal ${name}</h1>`);
    console.log(req.body)
};

export default testController1;

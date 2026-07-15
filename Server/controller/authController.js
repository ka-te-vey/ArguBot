const express = require('express');

exports.getUser = async (req, res) => {
    try {
        const getUser = await findAll();

        return res.status(201).json({ message: "User existed!" })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


exports.createUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const newUser = await create({
            name, 
            email,
            password
        });

        res.status(201).json({ message: "Created User Successfully!" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;

    try {
        const updateUser = await userUpdate.findById( id );
        
        if(!existingUser) {
            return res.status(201).json({ message: "User does not exist!" });
        }

        const existingUser = await updateUser({
            name,
            email,
            password
        });

        return res.status(201).json({ message: "Updated Successfully!"  })
        
    } catch (error) {
        return res.status(500).json({ message: error.message});
    }
};


exports.deleteUser = async (req, res) => {
    const { id } = req.body;
    try {
        const deleteUser = await findById( id );

        if(!existingUser){
            return res.status(404).json({ message: "User not found" });
        }

        await deleteUser.destroy()
        return res.status(201).json({ message: "Delete User successfully!" });


    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const Playlist = require('../models/playlist-model')
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/
createPlaylist = (req, res) => {
    const body = req.body;
    console.log("createPlaylist body: " + body);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Playlist',
        })
    }

    const playlist = new Playlist(body);
    console.log("playlist: " + JSON.stringify(body));
    if (!playlist) {
        return res.status(400).json({ success: false, error: err })
    }

    playlist
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                playlist: playlist,
                message: 'Playlist Created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Playlist Not Created!',
            })
        })
}
readPlaylistById = async (req, res) => {
    await Playlist.findOne({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        return res.status(200).json({ success: true, playlist: list })
    }).catch(err => console.log(err))
}
readAllPlaylists = async (req, res) => {
    await Playlist.find({}, (err, playlists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!playlists.length) {
            return res
                .status(404)
                .json({ success: false, error: `Playlists not found` })
        }
        return res.status(200).json({ success: true, data: playlists })
    }).catch(err => console.log(err))
}
readPlaylistPairs = async (req, res) => {
    await Playlist.find({}, (err, playlists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!playlists.length) {
            return res
                .status(404)
                .json({ success: false, error: 'Playlists not found' })
        }
        else {
            // PUT ALL THE LISTS INTO ID, NAME PAIRS
            let pairs = [];
            for (let key in playlists) {
                let list = playlists[key];
                let pair = {
                    _id: list._id,
                    name: list.name
                };
                pairs.push(pair);
            }
            return res.status(200).json({ success: true, idNamePairs: pairs })
        }
    }).catch(err => console.log(err))
}

updatePlaylist = async (req, res) => {
    try {
        const {id} = req.params;
        const {action, newPlaylistName, song, index, newIndex, } = req.body;

        const playlist = await Playlist.findOne({ _id: id });
        if (!playlist) {
            return res.status(404).json({
                success: false,
                message: 'no playlist found',
            });
        }

        if (action === 'rename') {
            if (!newPlaylistName) {
                return res.status(400).json({ success: false, message: 'need name' });
            }
            playlist.name = newPlaylistName;
        }

        else if (action === 'addSong') {
            if (!song) {
                return res.status(400).json({ success: false, message: 'need song data' });
            }
            playlist.songs.push(song);
        }

        else if (action === 'moveSong') {
            if (index === undefined || newIndex === undefined) {
                return res.status(400).json({ success: false, message: 'need indicies' });
            }
            const [movedSong] = playlist.songs.splice(index, 1);
            playlist.songs.splice(newIndex, 0, movedSong);
        }

        else if (action === 'editSong') {
            if (index === undefined || song === undefined) {
                return res.status(400).json({ success: false, message: 'need index, field, and val' });
            }
            if (playlist.songs[index]) {
                playlist.songs[index] = song
            } else {
                return res.status(404).json({ success: false, message: 'need real song' });
            }
        }

        else if (action === 'deleteSong') {
            if (index === undefined) {
                return res.status(400).json({ success: false, message: 'need song index' });
            }
            playlist.songs.splice(index, 1);
        }

        else {
            return res.status(400).json({
                success: false,
                message: 'no action',
            });
        }

        await playlist.save();
        return res.status(200).json({
            success: true,
            message: `updated using action: ${action}`,
            playlist: playlist,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'couldnt update',
            error: error.message,
        });
    }
};

deletePlaylist = async (req, res) => {
    try {
        const playlist = await Playlist.findOneAndDelete({ _id: req.params.id });

        if (!playlist) {
            return res.status(404).json({ success: false, error: 'playlist not found' });
        }

        return res.status(200).json({
            success: true,
            id: playlist._id,
            message: 'playlist deleted',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error,
            message: 'playlist not deleted',
        });
    }
};



module.exports = {
    createPlaylist,
    readAllPlaylists,
    readPlaylistPairs,
    readPlaylistById,
    updatePlaylist,
    deletePlaylist,
}
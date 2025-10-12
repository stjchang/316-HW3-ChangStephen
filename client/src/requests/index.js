/*
    This is our http api, which we use to send requests to
    our back-end API. Note we're using the Axios library
    for doing this, which is an easy to use AJAX-based
    library. We could (and maybe should) use Fetch, which
    is a native (to browsers) standard, but Axios is easier
    to use when sending JSON back and forth and it's a Promise-
    based API which helps a lot with asynchronous communication.
    
    @author McKilla Gorilla
*/

// WE USE THIS TO SEND REQUESTS TO THE BACK-END-API
import axios from 'axios'
const api = axios.create({
    baseURL: 'http://localhost:4000/api',
})

// THESE ARE ALL THE REQUESTS WE'LL BE MAKING, ALL REQUESTS HAVE A
// REQUEST METHOD (like get or post) AND PATH (like /playlist). SOME ALSO
// REQUIRE AN id SO THAT THE SERVER KNOWS ON WHICH LIST TO DO ITS
// WORK, AND SOME REQUIRE DATA, WHICH WE CALL THE payload, FOR WHEN
// WE NEED TO PUT THINGS INTO THE DATABASE OR IF WE HAVE SOME
// CUSTOM FILTERS FOR QUERIES
export const createPlaylist = (payload) => api.post(`/playlist`, payload)
export const readPlaylistById = (id) => api.get(`/playlist/${id}`)
export const readPlaylistPairs = () => api.get('playlistpairs')

// mine
export const renamePlaylist = (id, newPlaylistName) => api.put(`/playlist/${id}/rename`, { action: "renamePlaylist", newPlaylistName });
export const addSong = (id, song) => api.put(`/playlist/${id}/addSong`, { action: "addSong", song });
export const moveSong = (id, index, newIndex) => api.put(`/playlist/${id}/moveSong`, { action: "moveSong", index, newIndex });
export const editSong = (id, index, song) => api.put(`/playlist/${id}/editSong`, { action: "editSong", index, song });
export const deleteSong = (id, index) => api.put(`/playlist/${id}/deleteSong`, { action: "deleteSong", index });

export const deletePlaylist = (id) => api.delete(`/playlist/delete/${id}`);

export const getPlaylistsByPrefix = (prefix) => api.get(`/playlists/getPlaylistsByPrefix?prefix=${prefix}`);
export const getUniqueSongs = () => api.get(`/playlists/getUniqueSongs`);


const requestSender = {
    createPlaylist,
    readPlaylistById,
    readPlaylistPairs,
    renamePlaylist,
    deletePlaylist,
    addSong,
    editSong,
    moveSong,
    deleteSong,
}

export default requestSender
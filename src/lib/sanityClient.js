import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const sanityClient = createClient({
    projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
    dataset: process.env.REACT_APP_SANITY_PROJECT_DATASET,
    useCdn: true,
    apiVersion: "2023-01-01"
})

const isLocalDataEnabled = process.env.REACT_APP_ENV === 'DEV'
    && process.env.REACT_APP_LOCAL_DATA_FILE_NAME

const fetchLocalData = () => fetch(process.env.REACT_APP_LOCAL_DATA_FILE_NAME)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Unable to load local portfolio data: ${response.status} ${response.statusText}`)
        }
        return response.json()
    })

const fetchPortfolioData = (query, selectLocalData) => {
    if (isLocalDataEnabled) {
        return fetchLocalData().then(selectLocalData)
    }
    return sanityClient.fetch(query)
}

const ABOUT_QUERY = `*[_type == "about"]{
    title,
    favMeme,
    skills,
    bannerPic,
    intro,
    resume,
    myPic,
    "resumeURL": resume.asset->url
}`

export const fetchAppData = () => {
    if (isLocalDataEnabled) {
        return fetchLocalData().then(data => ({
            members: data.members,
            about: data.intro[0]
        }))
    }
    return Promise.all([
        sanityClient.fetch(`*[_type == "members"]`),
        sanityClient.fetch(ABOUT_QUERY)
    ]).then(([members, about]) => ({
        members,
        about: about[0]
    }))
}

export const fetchEducation = () => fetchPortfolioData(
    `*[_type == "education"]{
        school,
        startDate,
        endDate,
        url,
        degree,
        program,
        location
    }`,
    data => data.education
)

export const fetchWork = () => fetchPortfolioData(
    `*[_type == "work"]`,
    data => data.work
)

export const fetchSoftware = () => fetchPortfolioData(
    `*[_type == "software"]{
        description,
        links,
        members,
        picture,
        startDate,
        endDate,
        title,
        tech_stack
    }`,
    data => data.software
)

export const fetchMusic = () => fetchPortfolioData(
    `*[_type == "music"]`,
    data => data.music
)

export const imgUrlBuilder = imageUrlBuilder(sanityClient)

export const urlFor = source => imgUrlBuilder.image(source)
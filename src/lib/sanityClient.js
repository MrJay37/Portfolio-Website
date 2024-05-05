import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const sanityClient = createClient({
    projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
    dataset: process.env.REACT_APP_SANITY_PROJECT_DATASET,
    useCdn: true,
    apiVersion: "2023-01-01"
})

export const imgUrlBuilder = imageUrlBuilder(sanityClient)

export const urlFor = source => imgUrlBuilder.image(source)
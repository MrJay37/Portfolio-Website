import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const sanityClient = createClient({
    projectId: "evljjp3l",
    dataset: "production",
    useCdn: true,
    apiVersion: "2023-01-01"
})

export const imgUrlBuilder = imageUrlBuilder(sanityClient)

export const urlFor = source => imgUrlBuilder.image(source)
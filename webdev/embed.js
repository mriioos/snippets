/**
 * How to import:
 * <script data-domain="whitelisteddomain.ext" type="text/javascript" defer src="yourdomain.ext/route/to/this/script/embed.js"></script> <!-- data-domain empty = just base domain -->
 * 
 * How to use:
 * <div data-embedsrc="/route/to/your/sinippet.html"></div> <!-- This is a placeholder -->
 * 
 * The placeholder tag will be replaced by the snippet, only whitelisted domains and the current domain will be accepted.
 * 
 * This script includes protection against Embeding XSS Attacks by whitelisting the provided domains. Only include trusted domains with https protocols.
 * Add attribute data-domain="https://domaintowhitelist.ext" to whitelist the domain.
 * The document's hostname is always accepted as valid.
 * Add more script tags to whitelist more domains.
 */

/**
 * Get the domain passed to this script that specify valid source (To prevent Embedment XSS attacks).
 * By default, only snippets relative to the server's domain are accepted.
 */
const domain = document.currentScript.getAttribute('data-domain') || window.location.hostname;

/**
 * Procedure to embed elements from urls given the attribute name that holds the htmls url.
 * The elements can include their own as links or script[src] tags css and js snippets.
 * @param {string} attributeName To be used in the search of placeholder elements "document.querySelectorAll(`[${attributeName}]`);"
 */ 
function embedElements(attributeName){

    // Get placeholders that have the data-embedsrc attribute
    const placeholders = document.querySelectorAll(`[${attributeName}]`);

    // Go thru each placeholder downloading the snippet
    placeholders.forEach((placeholder) => {
 
        const url = placeholder.getAttribute(attributeName);

        // Check validity of source url (To prevent XSS attacks)
        try{
            const parsedURL = new URL(url, domain);

            if(parsedURL.hostname != domain) return; // Ignore placeholder

            // Alert user if protocol is http
            const lang = (navigator.language || navigator.userLanguage).split('-')[0]; // Fallback for older browsers
            const message = lang == 'es' ? 'Esta página contiene conexiones no seguras. Pulse aceptar para ignorar.' : 'This page cotains unsecure connections. Press accept to ignore.';
            if(parsedURL.protocol === "http:") alert(message);
        }
        catch(err){
            console.log(`Invalid URL: ${err}`);
            return; // Ignore placeholder
        }

        // fetch source
        fetch(url, {
            method : 'GET',
            headers : {
                'Accept' : 'text/html'
            },
            mode : 'cors',
            credentials : 'include' // Include cookies for auth if required
        })
        .then((response) => {

            // Check that the request was a success
            if(!response.ok){
                throw new Error(`{ URL : ${url}, status : ${response.status}, text : ${response.statusText}}`);
            }

            // Return the HTML
            return response.text();
        })
        .then((sourceHTML) => {

            // Evaluate if the HTML source is empty
            if(sourceHTML.trim()){

                // Embed sourceHTML to document at placeholder
                embedElement(placeholder, sourceHTML);
            }

            // Delete the placeholder
            placeholder.remove();
        })
        .catch((err) => {
            console.log(`Error : ${err}`);
        });
    });
}

/**
 * Function to embed a single element givven its placeholder and HTML.
 * @param {Element} placeholder Element to be substituted by the new element.
 * @param {string} sourceHTML That holds the new elements HTML
 */
function embedElement(placeholder, sourceHTML){

    // Create a temp continer
    const temp = document.createElement('div');
    temp.innerHTML = sourceHTML;

    // Extract scripts and links as new elements
    const scriptEls = getClonedElements(temp, 'script', true);
    const linkEls = getClonedElements(temp, 'link', true);

    // Check that no embed.js scripts are embeded

    // Insert the modified data next to the placeholder
    placeholder.insertAdjacentHTML('afterend', temp.innerHTML);

    // Insert the cloned script and link elements in the embeded element
    const element = placeholder.nextElementSibling;
    element.prepend(...scriptEls);
    element.prepend(...linkEls);

    // Remove temp element
    temp.remove();
}

/**
 * Function to select elements from a container and clone them, with their attributes.
 * @param {Element} container Where to find the elements.
 * @param {string} selector To use on querySelectorAll to find the required elements.
 * @param {Boolean} remove Indicates whether the selected elements should also be removed from parent element (True = yes).
 * @returns {Element[]} Array containing all the new elements.
 */
function getClonedElements(container, selector, remove){
    const elements = [];
    container.querySelectorAll(selector)
    .forEach((selected) => {

        // Clone element to a new element
        const element = document.createElement(selected.tagName);

        // Iterate over attributes
        selected.getAttributeNames()
        .forEach((attribute) => {
            element.setAttribute(attribute, selected.getAttribute(attribute));
        });

        // Add content
        element.innerHTML = selected.innerHTML;

        // Push the cloned element
        elements.push(element);

        // Remove selected element from container
        if(remove) selected.remove();
    });

    return elements
}

// Autocall the function
embedElements('data-embedsrc');
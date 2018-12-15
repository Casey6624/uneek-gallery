import React from "react";

const Loading = (props) => {

    return(  
    
        <div className="SVGSpinner">
        <svg 
        xmlns="http://www.w3.org/2000/svg" 
        xmlnsXlink="http://www.w3.org/1999/xlink" 
        version={1.0} 
        width="128px" 
        height="128px" 
        viewBox="0 0 128 128" 
        xmlSpace="preserve"
        >
        <path 
        fill="#333" 
        fillOpacity={1} d="M111.708,49A50.116,50.116,0,0,0,79,16.292V1.785A64.076,64.076,0,0,1,126.215,49H111.708ZM49,16.292A50.114,50.114,0,0,0,16.292,49H1.785A64.075,64.075,0,0,1,49,1.785V16.292ZM16.292,79A50.116,50.116,0,0,0,49,111.708v14.507A64.076,64.076,0,0,1,1.785,79H16.292ZM79,111.708A50.118,50.118,0,0,0,111.708,79h14.507A64.078,64.078,0,0,1,79,126.215V111.708Z">
        <animateTransform 
        attributeName="transform" 
        type="rotate" 
        from="0 64 64" 
        to="-90 64 64" 
        dur="1000ms" 
        repeatCount="indefinite" />
        </path>
        <path 
        fill="#333" 
        fillOpacity={1} d="M96.971,53.633a34.634,34.634,0,0,0-22.6-22.6V21A44.283,44.283,0,0,1,107,53.633H96.971Zm-43.338-22.6a34.634,34.634,0,0,0-22.6,22.6H21A44.283,44.283,0,0,1,53.633,21V31.029Zm-22.6,43.338a34.634,34.634,0,0,0,22.6,22.6V107A44.283,44.283,0,0,1,21,74.367H31.029Zm43.338,22.6a34.634,34.634,0,0,0,22.6-22.6H107A44.283,44.283,0,0,1,74.367,107V96.971Z">
        <animateTransform 
        attributeName="transform" 
        type="rotate" 
        from="0 64 64" 
        to="90 64 64" 
        dur="1000ms" 
        repeatCount="indefinite" />
        </path>
        <path 
        fill="#333" 
        fillOpacity={1} d="M85.47,57.25A22.552,22.552,0,0,0,70.75,42.53V36A28.836,28.836,0,0,1,92,57.25H85.47ZM57.25,42.53A22.552,22.552,0,0,0,42.53,57.25H36A28.836,28.836,0,0,1,57.25,36V42.53ZM42.53,70.75A22.552,22.552,0,0,0,57.25,85.47V92A28.836,28.836,0,0,1,36,70.75H42.53ZM70.75,85.47A22.552,22.552,0,0,0,85.47,70.75H92A28.836,28.836,0,0,1,70.75,92V85.47Z">
        <animateTransform 
        attributeName="transform" 
        type="rotate" 
        from="0 64 64" 
        to="-90 64 64" 
        dur="1000ms" 
        repeatCount="indefinite" />
        </path>
        
        </svg>
        </div>

        )
}

export default Loading;
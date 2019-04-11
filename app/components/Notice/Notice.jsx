/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';

 export default function Notice(props) {

  let dismissTimeout
  /* this useEffect mimics componentDidMount and componentWillUnmount()*/
  useEffect(() => {
    if (props.duration > 0) { 
      dismissTimeout = window.setTimeout(props.onDismissClick, props.duration);
    }

    if (dismissTimeout) {  
      window.clearTimeout(dismissTimeout); 
    }

  }, [])

    let dismiss; 
     if (props.showDismiss) { 
      dismiss = ( 
        <span tabIndex="0" className="notice_dismiss" onClick={ props.onDismissClick } >
          <span className="dashicons dashicons-dismiss"></span>
          <span className="screen-reader-text">Dismiss</span>
        </span>
      );
    }
     return (
      <div className={`notice is-dismissible notice-${props.notice.type}`}>
        <p><strong>{props.notice.message}</strong></p>
        { dismiss }
      </div>
    );
  }

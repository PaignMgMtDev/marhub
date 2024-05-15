export const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    // Get the components of the date
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
  
    // Format the date as MM/DD/YYYY
    const formattedDate = `${month}/${day}/${year}`;
  
    return formattedDate;
};
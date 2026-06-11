import json
import boto3
import uuid
from datetime import datetime

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("Tasks")

def response(status_code, body):
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        },
        "body": json.dumps(body)
    }

def lambda_handler(event, context):
    method = event.get("requestContext", {}).get("http", {}).get("method")

    if method == "OPTIONS":
        return response(200, {"message": "OK"})

    if method == "POST":
        body = json.loads(event.get("body", "{}"))

        task = {
            "taskId": str(uuid.uuid4()),
            "title": body.get("title", ""),
            "description": body.get("description", ""),
            "status": body.get("status", "pending"),
            "createdAt": datetime.utcnow().isoformat()
        }

        table.put_item(Item=task)
        return response(201, task)

    if method == "GET":
        result = table.scan()
        return response(200, result.get("Items", []))

    if method == "PUT":
        body = json.loads(event.get("body", "{}"))
        task_id = body.get("taskId")

        if not task_id:
            return response(400, {"error": "taskId is required"})

        table.update_item(
            Key={"taskId": task_id},
            UpdateExpression="SET title = :title, description = :description, #s = :status",
            ExpressionAttributeNames={"#s": "status"},
            ExpressionAttributeValues={
                ":title": body.get("title", ""),
                ":description": body.get("description", ""),
                ":status": body.get("status", "pending")
            }
        )

        return response(200, {"message": "Task updated successfully"})

    if method == "DELETE":
        body = json.loads(event.get("body", "{}"))
        task_id = body.get("taskId")

        if not task_id:
            return response(400, {"error": "taskId is required"})

        table.delete_item(Key={"taskId": task_id})
        return response(200, {"message": "Task deleted successfully"})

    return response(400, {"error": "Unsupported method"})